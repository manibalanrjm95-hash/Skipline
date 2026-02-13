import React from 'react';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-grey-100 rounded-xl ${className}`}
            {...props}
        />
    );
};

export default Skeleton;
