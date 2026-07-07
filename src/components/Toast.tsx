import { useToast } from '../hooks/useToast';

export function Toast() {
  const { message, visible } = useToast();
  return <div className={`toast${visible ? ' show' : ''}`}>{message}</div>;
}
