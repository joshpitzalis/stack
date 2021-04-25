import { firestore } from '../../utils/firebase';

export const handleSavePost = async (userId, content, postId) => {
  try {
    if (!content) throw new Error('no content');
    await firestore.doc(`posts/${postId}`).set({
      id: postId,
      author: userId,
      content,
      lastUpdated: new Date(),
    });
  } catch (error) {
    throw new Error('error saving post');
  }
};

export const getContent = (_postId, send) => firestore
.doc(`posts/${_postId}`)
.get()
.then(_doc => {
  if (_doc.exists) {
    send({
      type: 'HYDRATED',
      payload: _doc.data(),
    });
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
})
.catch(error => {
  console.log('Error getting document:', error);
});

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}


export const archivePoll = async (id, transition) => {
  try {
    await firestore.doc(`decisions/${id}`).update({ archived: true });
    transition('MODAL_CLOSED');
  } catch (error) {
    console.error('Error submitting vote:', error);
  }
};

export const unArchivePoll = async (id, transition) => {
  try {
    await firestore.doc(`decisions/${id}`).update({ archived: false });
    transition('MODAL_CLOSED');
  } catch (error) {
    console.error('Error submitting vote:', error);
  }
};