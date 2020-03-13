import { useState, useEffect, useContext } from 'react';
import { HDF5Link, HDF5GenericEntity, HDF5Id } from './models';
import { TreeNode } from '../explorer/models';
import { DataProviderContext } from './context';

export function useDomain(): string {
  const { getDomain } = useContext(DataProviderContext);
  return getDomain();
}

export function useMetadataTree(): TreeNode<HDF5Link> | undefined {
  const { getMetadataTree } = useContext(DataProviderContext);
  const [tree, setTree] = useState<TreeNode<HDF5Link>>();

  useEffect(() => {
    getMetadataTree().then(setTree);
  }, [getMetadataTree]);

  return tree;
}

export function useEntity(link?: HDF5Link): HDF5GenericEntity | undefined {
  const { getEntity } = useContext(DataProviderContext);
  const [entity, setEntity] = useState<HDF5GenericEntity | undefined>();

  useEffect(() => {
    getEntity(link).then(setEntity);
  }, [link, getEntity]);

  return entity;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useValue(id: HDF5Id): any {
  const { getValue } = useContext(DataProviderContext);
  const [value, setValue] = useState<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    getValue(id).then(setValue);
  }, [getValue, id]);

  return value;
}
