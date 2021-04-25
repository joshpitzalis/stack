import '@testing-library/jest-dom/extend-expect'

import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react'

import { Editor } from '../TrixEditor';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

it('lets me save text', async () => {

  render(<Editor />)
  // await waitFor(() => screen.findByText("editor is ready"))
  // editor-T61108d92-a0a0-453d-a024-9fcdc4b57acc
  userEvent.type(screen.getByText("editor is ready"), 'Hello, World!')
  // fireEvent.click(screen.getByText('Load Greeting'))

  // await waitFor(() => screen.getByRole('heading'))

  expect(screen.getByText('hello there')).toHaveTextContent('hello there')
  // expect(screen.getByRole('button')).toHaveAttribute('disabled')

});

it('lets me load saved text', () => {});
it('upload images', () => {});
it('lets me cancel without saving', () => {});
it('add toolbar formating to editor', () => {});
it('sanitize html', () => {});
it('loding indicator for text after save', () => {});
it('save teh post with the correct author details, not post ID', () => {});
it('be able to link to a stand along page, not a modal', () => {});
