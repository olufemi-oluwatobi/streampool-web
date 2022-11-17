import React, { createContext, useEffect, useContext, useReducer } from "react";
import StreamService, { PoolPayload } from "@services/streamServices";
import { AxiosResponse } from "axios";
import { PoolRequestType } from "@interfaces/index";

export type StreamPlan = {
  id: number;
  name: string;
  currency: string;
  max_limit: string;
  amount: string;
  stream_service_id: number;
  created_at: string;
  updated_at: string;
};

export type StreamService = {
  id: number;
  name: string;
  icon: string;
  entrance_type: "credentials" | "invites";
  created_at: string;
  updated_at: string;
  is_disabled: boolean;
  planCount: number;
  poolCount: string;
  categories: Categories[];
  streamPlans: StreamPlan[];
};

export interface Categories {
  is_active: boolean;
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export type RequestCallback = {
  onSuccess: () => void;
  onError: (error: Error) => void;
};

type StreamServiceContextType = {
  streamServices: StreamService[];
  streamService: StreamService | null;
  setStreamServices: (data: any) => void;
  setStreamService: (data: StreamService) => void;
  isLoading: boolean;
  setFetchingStreamService: (data: boolean) => void;
  fetchStreamServives: () => Promise<void>;
  cancelRequest: (id: number) => Promise<number>;
  requestMembership: (data: {
    streamServiceId: number;
    customEmail?: string;
    poolId?: number;
  }) => Promise<AxiosResponse<{ success: true; data: PoolRequestType }>>;
  createPool: (d: PoolPayload) => Promise<void>;
  acceptRequest: (
    poolRequestId: number,
    requestData: { userId: string; poolId: number }
  ) => Promise<void>;
  disablePool: (poolId: number) => Promise<void>;
};
export const StreamServiceContext = createContext(
  {} as StreamServiceContextType
);

export const useStreamService = () => useContext(StreamServiceContext);

const initialState = {
  streamServices: [] as StreamService[],
  streamService: null,
  meta: {
    isLoading: false,
  },
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "REQUEST_STREAM_SERVICES":
      return Object.assign({}, state, {
        meta: {
          isLoading: action.payload,
        },
      });
    case "SET_STREAM_SERVICE":
      return Object.assign({}, state, {
        streamService: action.payload,
      });
    case "GET_STREAM_SERVICE_SERVICE":
      return Object.assign({}, state, {
        streamServices: action.payload,
      });
    default:
      return state;
  }
};

export const StreamServiceProvider = ({ children }) => {
  const [
    {
      streamServices,
      streamService,
      meta: { isLoading },
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  //   const [streamServices, setStreamServices] = useState([]);
  //   const [isLoading, setLoading] = useState(false);

  const setStreamServices = (data) => {
    dispatch({ type: "GET_STREAM_SERVICE_SERVICE", payload: data });
  };

  const setStreamService = (data) => {
    dispatch({ type: "SET_STREAM_SERVICE", payload: data });
  };

  const setLoading = (data: boolean) => {
    dispatch({ type: "REQUEST_STREAM_SERVICES", payload: data });
  };

  useEffect(() => {
    loadStreamServices();
    fetchStreamServives();
  }, []);

  const loadStreamServices = () => {
    let services = localStorage.getItem("StreamServices");
    if (services) {
      services = JSON.parse(services);
      setStreamServices(services);
    }
  };
  const fetchStreamServives = async () => {
    try {
      setLoading(true);
      const { data } = await StreamService.getStreamServices();
      if (data?.success) {
        setStreamServices(data?.data);
        localStorage.setItem("StreamServices", JSON.stringify(data?.data));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const requestMembership = async (requestData: {
    streamServiceId: number;
    customEmail?: string;
    poolId?: number;
  }): Promise<AxiosResponse<{ success: true; data: PoolRequestType }>> => {
    try {
      setLoading(true);
      const data = await StreamService.requestToJoin(requestData);
      if (data) {
        return Promise.resolve(data);
      }
    } catch (error) {
      return Promise.reject();
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (id: number) => {
    try {
      setLoading(true);
      const { data } = await StreamService.cancelRequest(id);
      if (data.success) {
        return Promise.resolve(id);
      }
    } catch (error) {
      return Promise.reject();
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (
    poolRequestId: number,
    requestData: { userId: string; poolId: number }
  ) => {
    try {
      const { data } = await StreamService.addToPool(
        poolRequestId,
        requestData
      );
      if (data.success) {
        return Promise.resolve();
      }
    } catch (error) {
      return Promise.reject();
    } finally {
    }
  };

  const createPool = async (d: PoolPayload) => {
    try {
      const { data } = await StreamService.createPool(d);
      if (data.success) {
        return Promise.resolve();
      }
    } catch (error) {
      return Promise.reject();
    } finally {
    }
  };

  const disablePool = async (poolId: number) => {
    try {
      const { data } = await StreamService.disablePool(poolId);
      if (data.success) {
        return Promise.resolve();
      }
    } catch (error) {
      return Promise.reject();
    } finally {
    }
  };

  return (
    <StreamServiceContext.Provider
      value={{
        streamServices,
        streamService,
        setStreamServices,
        setStreamService,
        isLoading,
        setFetchingStreamService: setLoading,
        fetchStreamServives,
        requestMembership,
        cancelRequest,
        createPool,
        acceptRequest,
        disablePool,
      }}
    >
      {children}
    </StreamServiceContext.Provider>
  );
};
