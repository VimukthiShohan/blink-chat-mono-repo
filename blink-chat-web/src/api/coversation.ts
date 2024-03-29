import { useMutation, useQuery } from '@tanstack/react-query';

import { ApiServiceErr, axiosApi, MutOptions } from '@/api/apiService';
import {
  ConversationCreateBody,
  ConversationDeleteResponse,
  ConversationMessageBody,
  ConversationMessageResponse,
  ConversationMessagesResponse,
  ConversationResponse,
} from '@/types/conversation.types';

export const useGetConversations = () =>
  useQuery<ConversationResponse[], ApiServiceErr>(
    [`/conversation`],
    async () => {
      const response = await axiosApi.get(`/conversation`);
      return response.data;
    },
  );

export const useGetConversationMessages = (conversationId: string) =>
  useQuery<ConversationMessagesResponse[], ApiServiceErr>(
    [`/conversation/messages/${conversationId}`],
    async () => {
      const response = await axiosApi.get(
        `/conversation/messages/${conversationId}`,
      );
      return response.data;
    },
  );

export const useSendMessage = (opt?: MutOptions<ConversationMessageResponse>) =>
  useMutation<
    ConversationMessageResponse,
    ApiServiceErr,
    ConversationMessageBody
  >(async (data) => {
    const { conversationId, msg } = data;
    const response = await axiosApi.post(
      `/conversation/messages/create/${conversationId}`,
      { msg },
    );
    return response.data;
  }, opt);

export const useCreateConversation = (opt?: MutOptions<ConversationResponse>) =>
  useMutation<ConversationResponse, ApiServiceErr, ConversationCreateBody>(
    async (data) => {
      const response = await axiosApi.post('/conversation/create', data);
      return response.data;
    },
    opt,
  );

export const useDeleteConnversation = (
  opt?: MutOptions<ConversationDeleteResponse>,
) =>
  useMutation<ConversationDeleteResponse, ApiServiceErr, string>(async (id) => {
    const response = await axiosApi.delete(`/conversation/${id}`);
    return response.data;
  }, opt);
