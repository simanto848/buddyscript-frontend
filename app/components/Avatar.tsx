import React from 'react';

interface AvatarProps {
  avatarUrl?: string | null;
  firstName?: string;
  lastName?: string;
  size?: string;
  fontSize?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function Avatar({
  avatarUrl,
  firstName = '',
  lastName = '',
  size = '42px',
  fontSize = '14px',
  style,
  className
}: AvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${firstName} ${lastName}`}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          ...style
        }}
      />
    );
  }

  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  const initials = `${firstInitial}${lastInitial}` || '?';

  const hashString = `${firstName} ${lastName}`;
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    hash = hashString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#377DFF',
    '#00BA9B',
    '#FF4D4F',
    '#FFA800',
    '#7F3DFF',
    '#2D3748',
  ];
  const bgColor = colors[Math.abs(hash) % colors.length];

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bgColor,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: fontSize,
        userSelect: 'none',
        textTransform: 'uppercase',
        ...style
      }}
    >
      {initials}
    </div>
  );
}
