import ApiClient from "../network/ApiClient";
import { 
    GetAuthNonceResponse, 
    AuthVerifyData, 
    AuthVerifyResponse, 
    UploadFileResponse,
    AuctionListParams,
    AuctionListResponse,
    SaveNFTInfoData,
    SaveNFTInfoResponse
 } from "./types";

export default class LoginService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }
    
    // 获取登录签名信息
    async getAuthNonce(address: string): Promise<GetAuthNonceResponse> {
        return await this.apiClient.get(`/user/${address}/login-message`);
    }

    // 登录-接口返回token
    async postUserLogin(data: AuthVerifyData): Promise<AuthVerifyResponse> {
        return await this.apiClient.post<AuthVerifyData, AuthVerifyResponse>(`/user/login`, data);
    }

    // 获取用户签名状态
    async getUserAuthStatus(address: string) {
        return await this.apiClient.get(`/user/${address}/sig-status`);
    }

    // 上传文件（创建NFT）
    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return await this.apiClient.post<FormData, UploadFileResponse>(`/uploadFile/uploadNftFile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    // 保存NFT信息
    async saveNFTInfo(data: SaveNFTInfoData) {
        return await this.apiClient.post<SaveNFTInfoData, SaveNFTInfoResponse>(`/collections/createNft`, data);
    }

    // 获取拍卖信息列表
    async getAuctionList(params: AuctionListParams) {
        return await this.apiClient.get<AuctionListResponse>(`/auctions`, { 
            params: {
                filters: JSON.stringify(params.filters)
            }
         });
    }
}

