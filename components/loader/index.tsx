import React, { FC } from 'react';


interface Props {
  on: boolean;
}

const Loader: FC<Props> = ({ on }) => {
  if (!on) return null;

  return (
    <div className='loader-wrapper'>
      <ul className='loader'>
        <li className='center' />
        <li className='item item-1' />
        <li className='item item-2' />
        <li className='item item-3' />
        <li className='item item-4' />
        <li className='item item-5' />
        <li className='item item-6' />
        <li className='item item-7' />
        <li className='item item-8' />
      </ul>
    </div>
  )
}

export default Loader
