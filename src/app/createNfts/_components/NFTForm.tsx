'use client'

import React, { useRef, useState } from 'react';
import { Box, TextField, Typography, Select, MenuItem, Button, FormControl, SelectChangeEvent, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import * as GlobalStore from '@/stores/GlobalStore';
import {
  useAccount,
  useWriteContract,
  usePublicClient,
} from 'wagmi';
import { PublicClient, Address } from 'viem';
import CustomWalletButton from '@/components/CustomWalletButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Image from 'next/image';
import { Category, Blockchain } from './constants';
import { config } from '@/config/chains';
import { NFTAuctionAbi, NFTAuctionAbiAddress } from '@/constants/abis';
import { toast } from "react-toastify";
import services from '@/services';

type FormData = {
  name: string;
  description: string;
  category: Category;
  blockchain: Blockchain;
  royalty: string;
  file: File | null;
  previewUrl: string;
  urlPath: string;
}

interface NFTFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function NFTForm({ formData, setFormData }: NFTFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDisconnected, address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(false);
  // console.log('ZYP-dev 📍 NFTForm.tsx 📍 NFTForm 📍 isDisconnected:', isDisconnected);

  const publicClient = usePublicClient() as PublicClient;

  const {
    writeContractAsync,
    data
 } = useWriteContract({
    config
 });
  console.log('ZYP-dev 📍 NFTForm.tsx 📍 NFTForm 📍 data:', data);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setNameError(!value.trim());
    }
    if (name === 'royalty') {
      const numValue = Number(value);
      if (numValue > 100) return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const res = await services.did.uploadFile(file);
      console.log('ZYP-dev 📍 NFTForm.tsx 📍 handleFileChange 📍 res:', res);
      setFormData(prev => ({
        ...prev,
        file,
        previewUrl: URL.createObjectURL(file),
        urlPath: res.path
      }));
    }
  };

  const handleFileDelete = () => {
    if (formData.previewUrl) {
      URL.revokeObjectURL(formData.previewUrl);
    }
    setFormData(prev => ({
      ...prev,
      file: null,
      previewUrl: '',
      urlPath: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    console.log('铸造NFT:', formData);
    setLoading(true)

    try {
      // 1. 铸造NFT
    const hash = await writeContractAsync({
      abi: NFTAuctionAbi,
      address: NFTAuctionAbiAddress,
      functionName: 'mint',
      args: [address as Address],
    });
    console.log('ZYP-dev 📍 NFTForm.tsx 📍 handleSubmit 📍 hash:', hash);
    if(!hash) {
      toast.error('铸造NFT失败')
      setLoading(false)
      return
    } 
      // 2. 等待交易确认      
      await publicClient.waitForTransactionReceipt({ hash });
      toast.success('铸造NFT成功')
      setLoading(false)
    } catch (error) {
      console.log('ZYP-dev 📍 NFTForm.tsx 📍 handleSubmit 📍 error:', error);
      toast.error('铸造NFT失败')
      setLoading(false)
    }
  };

  return (
    <Box className="bg-stone-50 p-6 rounded-lg shadow">
      <Typography variant="subtitle1" className="mb-6">NFT详情</Typography>
      
      {/* 文件上传区域 */}
      <Box 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center"
        sx={{
          '&:hover': {
            borderColor: 'primary.main'
          }
        }}
      >
        {!formData.previewUrl ? (
          <>
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                mb: 2,
                textTransform: 'none',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'rgba(108, 99, 255, 0.04)'
                }
              }}
            >
              选择文件
            </Button>
            <Typography variant="body2" color="text.secondary">
              支持 JPG, PNG, GIF, MP4, MP3 格式，文件大小不超过 50MB
            </Typography>
          </>
        ) : (
          <Box sx={{ position: 'relative' }}>
            {formData.file?.type.startsWith('image/') ? (
              <Image
                src={formData.previewUrl}
                alt="Preview"
                width={300}
                height={300}
                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
              />
            ) : (
              <video
                src={formData.previewUrl}
                controls
                style={{ objectFit: 'cover', maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
              />
            )}
            <IconButton
              onClick={handleFileDelete}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <DeleteIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* 表单字段 */}
      <Typography variant="subtitle1">NFT名称<span className="text-red-500">*</span></Typography>
      <TextField
        fullWidth
        required
        error={nameError}
        helperText={nameError ? "NFT名称不能为空" : ""}
        name="name"
        value={formData.name}
        onChange={handleTextChange}
        placeholder="为您的NFT命名"
        sx={{
          marginBottom: '16px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          '& .MuiInputBase-input': {
            color: 'black',
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.6)',
          },
          '& .MuiFormLabel-root.Mui-focused': {
            color: 'black',
          }
        }}
      />

      <Typography variant="subtitle1">描述</Typography>
      <TextField
        fullWidth
        required
        multiline
        rows={4}
        name="description"
        value={formData.description}
        onChange={handleTextChange}
        placeholder="描述您的NFT，包括其独特特性和背景故事"
        sx={{
          marginBottom: '16px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          '& .MuiInputBase-input': {
            color: 'black',
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.6)',
          },
          '& .MuiFormLabel-root.Mui-focused': {
            color: 'black',
          }
        }}
      />

      <Typography variant="subtitle1">类别</Typography>
      <FormControl fullWidth sx={{ marginBottom: '16px' }}>
        <Select
          name="category"
          value={formData.category}
          onChange={handleSelectChange}
          displayEmpty
          sx={{
            color: 'black',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'black',
            }
          }}
        >
          <MenuItem value="art">艺术</MenuItem>
          <MenuItem value="music">音乐</MenuItem>
          <MenuItem value="video">视频</MenuItem>
          <MenuItem value="photography">摄影</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle1">区块链</Typography>
      <FormControl fullWidth sx={{ marginBottom: '16px' }}>
        <Select
          name="blockchain"
          value={formData.blockchain}
          onChange={handleSelectChange}
          displayEmpty
          sx={{
            color: 'black',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'black',
            }
          }}
        >
          <MenuItem value="Ethereum">以太坊 (Ethereum)</MenuItem>
          <MenuItem value="Polygon">Polygon</MenuItem>
          <MenuItem value="BSC">BSC</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle1">版税比例 (%)</Typography>
      <TextField
        fullWidth
        required
        name="royalty"
        type="number"
        value={formData.royalty}
        onChange={handleTextChange}
        placeholder="输入版税比例"
        inputProps={{
            max: 100,
            min: 0
          }}
        sx={{
          marginBottom: '16px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
           '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.5)',
            },
            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
              opacity: 1,
              margin: 0,
            }
          },
          '& .MuiInputBase-input': {
            color: 'black',
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.6)',
          },
          '& .MuiFormLabel-root.Mui-focused': {
            color: 'black',
          }
        }}
      />
      
      <Box className='mb-6'>
        {
          isDisconnected ? (
            <CustomWalletButton />
          ) : (
            <LoadingButton 
              variant="contained" 
              loading={loading}
              loadingPosition="start"
              fullWidth 
              size="large"
              disabled={!formData.name.trim()}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
              onClick={handleSubmit}
            >
              铸造NFT
            </LoadingButton>
          )
        }
      </Box>
    </Box>
  );
} 