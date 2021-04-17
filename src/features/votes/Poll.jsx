import firebase from 'firebase/app';
import React from 'react';
import { useAuth } from '../../hooks/auth';
import { useFireColl } from '../../hooks/firebase';
import { firestore } from '../../utils/firebase';
import Discussion from '../chat/Discussion';
import { Components } from './Components';
import { PostEditor } from './PostEditor';

const handleChange = async (voted, optionId, id, user, userUid) => {
  try {
    await firestore.doc(`decisions/${id}/options/${optionId}`).update({
      votes: voted
        ? firebase.firestore.FieldValue.arrayRemove(userUid)
        : firebase.firestore.FieldValue.arrayUnion(userUid),
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
  }
};

const submitNewOption = (voteId, value, setValue) => async e => {
  e.preventDefault();
  try {
    const newOption = await firestore
      .collection(`decisions/${voteId}/options`)
      .doc();

    await firestore
      .doc(`decisions/${voteId}/options/${newOption.id}`)
      .set({ title: value, id: newOption.id });

    setValue('');
  } catch (error) {
    console.error('Error submitting poll:', error);
  }
};

const deletePoll = async (id, transition) => {
  try {
    await firestore.doc(`decisions/${id}`).delete();
    transition('MODAL_CLOSED');
  } catch (error) {
    console.error('Error submitting vote:', error);
  }
};

const archivePoll = async (id, transition) => {
  try {
    await firestore.doc(`decisions/${id}`).update({ archived: true });
    transition('MODAL_CLOSED');
  } catch (error) {
    console.error('Error submitting vote:', error);
  }
};

const unArchivePoll = async (id, transition) => {
  try {
    await firestore.doc(`decisions/${id}`).update({ archived: false });
    transition('MODAL_CLOSED');
  } catch (error) {
    console.error('Error submitting vote:', error);
  }
};

export const Poll = ({ poll, transition }) => {
  const { id, title, deadline, archived } = poll;
  const options = useFireColl(`decisions/${id}/options`);
  const user = useAuth();
  const [value, setValue] = React.useState('');

  return (
    <section className="mw6-ns w-100 center tc ">
      <header>
        <h2 className="f1 lh-title">{title}</h2>
        {/* <h3>A little desctiption goes heres</h3> */}
      </header>
      <hr className="dn" />

      <PostEditor userId="foxtrot" postId={id} />

      {archived ? (
        <small
          className="washed-red b pointer mt3"
          onClick={() => unArchivePoll(id, transition)}
        >
          Unarchive this poll
        </small>
      ) : (
        <small
          className="washed-red b pointer mt3"
          onClick={() => archivePoll(id, transition)}
        >
          Archive this poll
        </small>
      )}

      <Discussion listId={id} />
    </section>
  );
};

export const InputForm = ({ submitNewOption, id, value, setValue }) => (
  <form onSubmit={submitNewOption(id, value, setValue)}>
    <Components
      value={value}
      setValue={setValue}
      placeholder="Add a new option to the mix..."
    />
    <button type="submit" className="db w-100 pa3 br3 ma0">
      Add An Option
    </button>
  </form>
);
