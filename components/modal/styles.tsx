import styled from 'styled-components';

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;

  height: 100%;
  overflow: hidden;
  outline: 0;

  display: grid;
  place-items: center;

  .container{
    display: flex;
    min-height: 100%;
  }
`

export const Overlay = styled.div`
  background: rgba(29, 30, 44, 0.32);
  backdrop-filter: blur(1rem);
  -webkit-backdrop-filter: blur(1rem);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
`

export const Inner = styled.div`
  max-height: 100rem;
  height:fit-content;
  z-index: 12;
  min-height: 25rem;
  box-shadow: 0px 0.4rem 4rem rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`

export const Close = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.4rem;
  border-radius: 50%;
  outline: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 3rem;
  right: 3.5rem;

`
