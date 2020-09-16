import React, { useState, useEffect } from 'react';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';

import Explorer from './explorer/Explorer';
import DatasetVisualizer from './dataset-visualizer/DatasetVisualizer';
import type { HDF5Link, HDF5Dataset } from './providers/models';
import MetadataViewer from './metadata-viewer/MetadataViewer';
import styles from './App.module.css';
import { isDataset } from './providers/utils';
import { useEntity } from './providers/hooks';
import type { TreeNode } from './explorer/models';
import BreadcrumbsBar from './BreadcrumbsBar';

function App(): JSX.Element {
  const [selectedDataset, setSelectedDataset] = useState<HDF5Dataset>();
  const [selectedNode, setSelectedNode] = useState<TreeNode<HDF5Link>>();

  const [isExplorerOpen, setExplorerOpen] = useState(true);
  const [isInspecting, setInspecting] = useState(false);

  const selectedLink = selectedNode?.data;
  const selectedEntity = useEntity(selectedLink);

  useEffect(() => {
    if (selectedEntity && isDataset(selectedEntity)) {
      setSelectedDataset(selectedEntity);
    } else {
      setSelectedDataset(undefined);
    }
  }, [selectedEntity]);

  return (
    <div className={styles.app}>
      <ReflexContainer orientation="vertical">
        <ReflexElement
          className={styles.explorer}
          style={{ display: isExplorerOpen ? undefined : 'none' }}
          flex={25}
          minSize={250}
        >
          <Explorer selectedNode={selectedNode} onSelect={setSelectedNode} />
        </ReflexElement>

        <ReflexSplitter
          style={{ display: isExplorerOpen ? undefined : 'none' }}
        />

        <ReflexElement className={styles.mainArea} flex={75} minSize={500}>
          <BreadcrumbsBar
            isExplorerOpen={isExplorerOpen}
            onToggleExplorer={() => setExplorerOpen(!isExplorerOpen)}
            isInspecting={isInspecting}
            onChangeInspecting={setInspecting}
            selectedNode={selectedNode}
          />
          {isInspecting ? (
            <MetadataViewer
              key={JSON.stringify(selectedLink)}
              link={selectedLink}
              entity={selectedEntity}
            />
          ) : (
            <DatasetVisualizer dataset={selectedDataset} />
          )}
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default App;
