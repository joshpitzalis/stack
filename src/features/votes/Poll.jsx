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



export const Poll = ({ poll, transition }) => {

  const options = useFireColl(`decisions/${poll?.id}/options`);
  const user = useAuth();
  const [value, setValue] = React.useState('');

  return (
    <section className="max-w-3xl w-100 center tc ">
      <h1 className="f1 lh-title">{poll?.title}</h1>
      <hr className="dn" />
      <PostEditor userId="foxtrot" 
      poll={poll} transition={transition}/>
      <Discussion listId={poll?.id} />
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
