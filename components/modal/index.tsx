import React, { FC, useEffect } from 'react';

import useStateCallback from '../../hooks/useStateCallback';

import * as Styled from './styles'

interface Props {
  children: (props: { toggle: VoidFunction }) => JSX.Element
  defaultOn?: boolean
  onClose?: (newState?: boolean) => void;
  header?: string | JSX.Element
}

const Index: FC<Props> = ({ defaultOn, header, children, onClose }) => {
  const [show, setShow] = useStateCallback(false)

  const toggle = () => setShow((state) => !state, (newState => onClose && onClose(newState)))

  useEffect(() => {
    if (defaultOn) {
      setShow(defaultOn)
    }

    document.body.style.overflow = show ? 'hidden' : 'auto';
  }, [defaultOn])

  if (!show) return null;

  return (
    <Styled.Wrapper className=' font-inter ' >
      <Styled.Overlay onClick={toggle} />
      <Styled.Inner className='rounded dark:bg-black-700 bg-[#ffffff] sm:w-[600px] w-full  max-h-full sm:h-auto h-auto overflow-auto ' >
        <div className=' w-full p-12 dark:bg-black-700 bg-[#ffffff]  font-semibold text-lg dark:text-og-white text-og-black flex justify-center items-center  '>
          {header}
        </div>
        {children({ toggle })}
      </Styled.Inner>
    </Styled.Wrapper>
  )
}

export default Index
