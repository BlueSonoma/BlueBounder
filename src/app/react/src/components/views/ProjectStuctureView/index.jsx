import { memo, useEffect, useState } from 'react';
import '../../../styles/sidebar.css';
import useSessionManager from '../../../hooks/useSessionManager';
import { API } from '../../../routes';

type ListItem = {
  name: string; type: string; children?: ListItem[];
}

function ProjectStructureListView({ children, ...rest }) {
  const [items, setItems] = useState([]);
  const { sessionName, setSessionName } = useSessionManager();

  useEffect(() => {
    fetch(`${API.Sessions}/get_session_Folder?sessionName=${sessionName}`, {
      method: 'GET',
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
    if (!item) {
      return null;
    }

    return (<>
      <label key={itemCounter++} style={{ padding: '5px' }}>{item.name}</label>
      {item.children?.map((child) => {
        return (<div
          style={{
            marginLeft: `${(level === 1 ? '10px' : '0')}`, padding: '2px',
          }}
        >
          <span>
            {Array(3 * level).fill('-').map((val) => val)}
            {getChildComponents(child, level + 1)}
          </span>
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