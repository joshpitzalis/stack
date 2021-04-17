import Timeline from 'antd/lib/timeline';
import React from 'react';
import { State, withStateMachine } from 'react-automata';
import { Header } from '../../components/ModuleHeader';
import { useFireColl } from '../../hooks/firebase';
import { firestore } from '../../utils/firebase';
import Modal from '../modals/Modal';
import { CreatePoll } from './CreatePoll';
import { Poll } from './Poll';
import { Vote } from './Vote';

export const voteMachine = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        POLL_CREATE_FORM_OPENED: 'newVote',
        EXISTING_POLL_OPENED: 'existingVote',
      },
    },
    newVote: {
      on: {
        MODAL_CLOSED: 'idle',
        POLL_CREATED: 'loading',
      },
    },
    existingVote: {
      on: {
        MODAL_CLOSED: 'idle',
      },
    },
    loading: {
      onEntry: 'createNewPoll',
      on: {
        SUCCEEDED: 'idle',
        ERRORRED: 'error',
      },
    },
    error: {
      on: {
        MODAL_CLOSED: 'idle',
      },
    },
  },
};

class Polls extends React.PureComponent {
  state = {
    payload: null,
    error: null,
  };

  createNewPoll = async (data = this.state.payload) => {
    const { transition } = this.props;
    try {
      const vote = await firestore.collection(`decisions`).doc();
      await firestore.doc(`decisions/${vote.id}`).set({
        title: data.title,
        createdBy: 'Josh',
        deadline: '7 days',
        id: vote.id,
      });

      for (const option of data.fields) {
        const newTask = await firestore
          .collection(`decisions/${vote.id}/options`)
          .doc();

        await firestore
          .doc(`decisions/${vote.id}/options/${newTask.id}`)
          .set({ title: option, id: newTask.id });
      }

      transition('SUCCEEDED');
    } catch (error) {
      transition('ERRORRED', { error });
    }
  };

  set = payload => this.setState({ payload });

  render() {
    const { transition } = this.props;
    return <Votes transition={transition} set={this.set} />;
  }
}

const ActiveVotes = ({ polls, transition, setId }) =>
  polls
    .filter(item => item.archived !== true)
    .map(poll => (
      <Vote key={poll.id} {...poll} dispatch={transition} setId={setId} />
    ));

const Votes = ({ transition, set }) => {
  const polls = useFireColl(`decisions`);
  const [id, setId] = React.useState('');
  const [archived, setArchived] = React.useState(true);
  return (
    <section className="mw9 center pa3 pa5-ns mb6">
      <State is="loading">Loading...</State>
      <State is="error">Error!</State>
      <State is="idle">
        <Header
          dispatch={transition}
          type="POLL_CREATE_FORM_OPENED"
          sectionTitle="Project Name"
        />
        {polls && (
          <ActiveVotes polls={polls} transition={transition} setId={setId} />
        )}
        <small
          className="pointer"
          role="button"
          tabIndex={0}
          onKeyDown={() => (archived ? setArchived(false) : setArchived(true))}
          onClick={() => (archived ? setArchived(false) : setArchived(true))}
        >
          {archived
            ? '+ Show Archived Decisions'
            : ' - Hide Archived Decisions'}
        </small>
        <br />
        <br />
        {!archived && polls && (
          <Timeline onMouseLeave={() => setArchived(true)}>
            {polls
              .filter(item => item.archived === true)
              .map(poll => (
                <Timeline.Item
                  className="pointer"
                  onClick={() => {
                    setId(poll.id);
                    transition({ type: 'EXISTING_POLL_OPENED' });
                  }}
                >
                  {poll.title}
                </Timeline.Item>
              ))}
          </Timeline>
        )}
      </State>
      <State is="newVote">
        <Modal onClose={() => transition('MODAL_CLOSED')}>
          <CreatePoll dispatch={transition} set={set} />
        </Modal>
      </State>
      <State is="existingVote">
        <Modal onClose={() => transition({ type: 'MODAL_CLOSED' })}>
          <Poll
            poll={polls.find(poll => poll.id === id)}
            transition={transition}
          />
        </Modal>
      </State>
    </section>
  );
};

export default withStateMachine(voteMachine)(Polls);
