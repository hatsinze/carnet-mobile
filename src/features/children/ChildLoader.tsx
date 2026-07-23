import { useEffect, type ReactNode } from 'react';
import { useMyEleves } from '../../hooks/useMyEleves';
import { useChildContext } from './ChildContext';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';

export function ChildLoader({ children }: { children: ReactNode }) {
  const { data, isLoading, isError, refetch } = useMyEleves();
  const { setChildren, isReady } = useChildContext();

  useEffect(() => {
    if (data) setChildren(data);
  }, [data]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Impossible de charger vos enfants." onRetry={refetch} />;
  if (!isReady) return <LoadingState />;

  return <>{children}</>;
}