// @ts-ignore
import client from '@/utils/client';
import { getNetwork } from '@/utils/helper';

const network = getNetwork();

export const getProposal = (params: any) => client.get(`block/${network}/hash/${params.hash}`);
export const getProposalByHeight = (params: any) => client.get(`block/${network}/height/${params.height}`);
export const getProposalList = (params: any) => client.get(`block/${params.network ? params.network : network}/page/${params.page}${params.total ? `?total=${params.total}` : ''}`);
