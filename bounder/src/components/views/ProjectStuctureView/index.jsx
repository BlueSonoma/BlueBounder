import { memo, useEffect, useState } from 'react';

import '../../../styles/sidebar.css'

type ListItem = {
  name: string; type: string; children?: ListItem[];
}

function ProjectStructureListView({ children, ...rest }) {
  const [items, setItems] = useState([]);

  function createRandomListItem() {
    const item = {
      name: 'File 0', type: 'Temporary File',
    };
    const children = [];
    if (Math.floor(Math.random() * 10) % 2 === 0) {
      for (let j = 0; j < Math.floor(Math.random() * 10) % 3; j++) {
        const child = createRandomListItem();
        child.name = 'File ' + j;
        children.push(child);
      }
    }
    item.children = children;
    return item;
  }


  useEffect(() => {
    const children = [];
    for (let i = 0; i < 10; i++) {
      const child = createRandomListItem();
      child.name = 'File' + i;
      children.push(child);
    }
    const root = {
      name: 'Root File', type: 'Temporary File', children,
    };


    setItems([root]);
  }, []);

  let itemCounter = 0;

  function getChildComponents(item: ListItem, level) {
    return (<>
      <label key={itemCounter++} style={{ padding: '5px' }}>{item.name}</label>
      {item.children?.map((child) => {
        return (<div
          style={{ marginLeft: `${(level === 1 ? '10px' : '0')}`, padding: '2px' }}>
          <span>{Array(3 * level).fill('-').map((val) => val)} {getChildComponents(child, level + 1)}</span>
        </div>);
      })}
    </>);
  }

  return (<>
    <div className={'project-structure-list-view'} {...rest}>
    {items?.map((item: ListItem) => getChildComponents(item, 1))}
    {children}
  </div></>);
}

export default memo(ProjectStructureListView);
