import React, { useEffect, useState } from 'react';
import multiavatar from '@multiavatar/multiavatar/esm';

function Avatar({ chatName }) {
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const svgCode = multiavatar(chatName);
    setAvatar(svgCode);
  }, [chatName]);

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: avatar }}
        style={{ width: '70px', height: '70px' }}
      />
    </div>
  );
}

export default Avatar;