import React from 'react';

function Messages() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="font-headline-xl text-headline-xl text-on-surface">Messages</h1>
      <div className="rounded-lg glass-effect p-6">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Contact form messages list with read/unread status
        </p>
      </div>
    </div>
  );
}

export default Messages;
