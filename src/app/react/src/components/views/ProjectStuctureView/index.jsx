import { memo, useEffect, useState } from 'react';
import { SessionContext } from '../../../contexts/sessionContext.js'; 
import { useContext } from 'react';
import '../../../styles/sidebar.css';

type ListItem = {
  name: string; type: string; children?: ListItem[];
}

function ProjectStructureListView({ children, ...rest }) {
  const [items, setItems] = useState([]);
  const { sessionName, updateSessionName } = useContext(SessionContext);

  useEffect(() => {
    const formData = new FormData();
    formData.append('sessionName', sessionName);
  
    fetch('http://localhost:8000/api/sessions/get_session_Folder', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        const parsedData = JSON.parse(data[0]);
        setItems([parsedData]); // Wrap the object in an array
        console.log(parsedData);
      })
      .catch(error => console.error('Error:', error));
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
    </div>
  </>);
}

export default memo(ProjectStructureListView);