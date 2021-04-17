// import firebase from 'firebase/app';
import React from 'react';
import { Button, Form, Input } from 'antd';
// import { useAuth } from '../../hooks/auth';
// import { useFireColl } from '../../hooks/firebase';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { firestore } from '../../utils/firebase';

const { TextArea } = Input;

// tests
// show error is problem saving
// show saving state in button
// !content should be a guard
// add images to post pages

const handleSavePost = async (userId, content, postId) => {
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

export const postMachine = Machine(
  {
    id: 'postEditor',
    context: {
      content: 'hello',
      error: '',
    },
    initial: 'reading',
    states: {
      reading: {
        on: { TOGGLED: 'writing' },
      },
      writing: {
        on: {
          TOGGLED: 'reading',
          TYPED: {
            actions: 'updateContent',
          },
          SUBMITTED: 'submitting',
        },
      },
      submitting: {
        invoke: {
          id: 'handleSavePost',
          src: (context, event) =>
            handleSavePost(
              event.payload.userId,
              context.content,
              event.payload.postId
            ),
          onDone: {
            target: 'reading',
          },
          onError: {
            target: 'writing',
            actions: assign({ error: (context, event) => event.data }),
          },
        },
      },
    },
  },
  {
    actions: {
      updateContent: assign((context, event) => ({
        content: event.payload.content,
      })),
    },
  }
);

export const PostEditor = ({ userId, postId }) => {
  const [current, send] = useMachine(postMachine);
  const { content } = current.context;

  return (
    <div>
      {current.matches('writing') && (
        <>
          <Form.Item>
            <TextArea
              rows={4}
              onChange={e =>
                send({
                  type: 'TYPED',
                  payload: { content: e.target.value },
                })
              }
              value={content}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={false}
              onClick={() =>
                send({
                  type: 'SUBMITTED',
                  payload: { userId, postId },
                })
              }
              type="primary"
            >
              Update
            </Button>
          </Form.Item>
        </>
      )}

      {current.matches('reading') && (
        <>
          <p>{content}</p>
          <Button
            htmlType="submit"
            loading={false}
            onClick={() => send('TOGGLED')}
            type="primary"
          >
            Edit
          </Button>
        </>
      )}
    </div>
  );
};
