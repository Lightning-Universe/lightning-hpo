import { useSnackbar } from 'lightning-ui/src/design-system/components';
import React, { useEffect } from 'react';
import { AppClient } from '../generated';

export const appClient = new AppClient({
  BASE:
    window.location != window.parent.location
      ? document.referrer.replace(/\/$/, '').replace('/view/undefined', '')
      : document.location.href.replace(/\/$/, '').replace('/view/undefined', ''),
});

const clientEndpoints = {
  sweeps: (appClient: AppClient) => appClient.appClientCommand.showSweepsCommandShowSweepsPost(),
  notebooks: (appClient: AppClient) => appClient.appClientCommand.showNotebooksCommandShowNotebooksPost(),
  tensorboards: (appClient: AppClient) => appClient.appCommand.showTensorboardsCommandShowTensorboardsPost(),
};

const clientDataContexts = {
  sweeps: React.createContext<any[]>([]),
  notebooks: React.createContext<any[]>([]),
  tensorboards: React.createContext<any[]>([]),
};

export const ClientDataProvider = (props: { endpoint: keyof typeof clientEndpoints; children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer((state: any[], newValue: any[]) => newValue, []);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const post = () => {
      clientEndpoints[props.endpoint](appClient)
        .then(data => dispatch(data))
        .catch(error => {
          enqueueSnackbar({
            title: 'Error Fetching Data',
            children: 'Try reloading the page',
            severity: 'error',
          });
        });
    };

    post();

    const interval = setInterval(() => {
      post();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const context = clientDataContexts[props.endpoint];
  return <context.Provider value={state}>{props.children}</context.Provider>;
};

const useClientDataState = (endpoint: keyof typeof clientEndpoints) => {
  const clientData = React.useContext(clientDataContexts[endpoint]);

  return clientData;
};

export default useClientDataState;
