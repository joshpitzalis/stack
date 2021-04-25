import { Editor } from './TrixEditor';
// import firebase from 'firebase/app';
import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
// import { useAuth } from '../../hooks/auth';
// import { useFireColl } from '../../hooks/firebase';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { firestore } from '../../utils/firebase';
import {handleSavePost, getContent} from './voteHelpers'
import {ReadingDropdown} from './ReadingDropdown'
const { TextArea } = Input;






export const postMachine = Machine(
  {
    id: 'postEditor',
    context: {
      content: '',
      error: '',
    },
    initial: 'reading',
    on: {
      HYDRATED: {
        actions: 'hydrateContent',

        internal: true,
      },
    },
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
      hydrateContent: assign((context, event) => ({
        content: event.payload.content,
      })),
    },
  }
);




export const PostEditor = ({ userId,  poll , transition }) => {
  const postId = poll?.id
  const [current, send] = useMachine(postMachine);
  const { content } = current.context;

  useEffect(() => {
    const _getContent = (a, b) => getContent(a, b)
  _getContent(postId, send)
}, [postId, send]);

  return (



    <div>


      {     current.matches('writing') && (
        <>
          <Form.Item>
          <div className="mt-20"/>
          <Editor content={content} send={send}/>
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
          <div
          className='tl'
           dangerouslySetInnerHTML={{
            __html: content
          }} />

          <ReadingDropdown   
          send={send} 
          poll={poll}
          transition={transition}   />
        </>
      )}
    </div>
  );
};

