import { memo, useEffect, useState } from 'react';
import useNodeSelector from '../../../hooks/useNodeSelector';
import useSessionManager from '../../../hooks/useSessionManager';
import Button from '../../../additional-components/buttons/Button';
import useAppState from '../../../hooks/useAppState';
import { API } from '../../../routes';
import Frame from '../../../containers/Frame';

function CleanUpView({ children, ...rest }) {
  const appState = useAppState();
  const { nodes } = useSessionManager();
  const { selectedNodes } = useNodeSelector();
  const [opacity, setOpacity] = useState(NaN);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const isNan = Number.isNaN(opacity);
    setDisabled(isNan);
  }, [opacity]);

  useEffect(() => {
    async function getOpacityValuesAsync() {
      return await selectedNodes.map(async (nd) => {
        return await fetch(`${API.Imaging}/get_alpha?path=${nd.data.file.path}`, { method: 'GET' })
          .then((response) => response.json())
          .then(({ data }) => data)
          .catch((e) => {
            setOpacity(NaN);
            console.log('Error fetching `get_alpha`', e);
          });
      });
    }

    appState.startLoadRequest();
    getOpacityValuesAsync().then((result) => {
      Promise.all(result)
        .then((values) => {
          values = values.filter((nd) => typeof nd !== 'undefined');
          if (values.length === 0 || values.length !== selectedNodes.length) {
            // There is at least one image that does not have an alpha channel
            setOpacity(NaN);
          } else {
            setOpacity(Math.max(values));
          }
          appState.endLoadRequest();
        });
    }).catch((e) => {
      setOpacity(NaN);
      console.log('Error fetching `get_alpha`', e);
    });
  }, [selectedNodes]);

  function onOpacityChangeHandler(event) {
    setOpacity(() => event.target.value);
  }

  function applyChanges() {
    async function applyChangesAsync() {
      selectedNodes.forEach((selected) => {
        const index = nodes.findIndex((nd) => nd.id === selected.id);
        if (index !== -1) {
          selectedNodes.forEach(async (nd) => {
            const formData = new FormData();
            formData.append('path', nd.data.file.path);
            formData.append('value', opacity);
            await fetch(`${API.Imaging}/set_alpha`, { method: 'POST', body: formData })
              .catch((e) => {
                setOpacity(NaN);
                console.log('Error fetching `set_alpha`', e);
              });

            // Reload each image
            selectedNodes.forEach((node) => {
              node.data.reload?.();
            });
          });
        }
      });
    }

    appState.startSaveRequest();
    applyChangesAsync().then(() => {
      appState.endSaveRequest();
    });
  }

  return (<>
    <Frame label={'Clean Up View'}>
      <span style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
        <label style={{ padding: '3px' }}>Opacity</label>
          <input
            disabled={disabled}
            type={'range'}
            style={{ width: '100%' }}
            min={0}
            max={255}
            value={disabled ? 0 : opacity}
            onChange={onOpacityChangeHandler} />
        {!disabled && <div
          style={{
            width: 'fit-content', padding: '2px', border: 'groove 2px',
          }}>{opacity}</div>}
        </span>
    </Frame>
    <Button
      disabled={disabled}
      label={'Apply'}
      onClick={applyChanges}
    />
  </>);
}

export default memo(CleanUpView);