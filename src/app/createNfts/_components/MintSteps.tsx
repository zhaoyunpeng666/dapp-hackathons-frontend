'use client'

import React from 'react';
import { Box, Typography, Grid2 as Grid } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const steps = [
  {
    icon: <CreateIcon fontSize="large" />,
    number: '1',
    title: '创建NFT',
    description: '上传您的数字作品并填写详细信息'
  },
  {
    icon: <CloudUploadIcon fontSize="large" />,
    number: '2',
    title: '铸造上链',
    description: '将您的NFT铸造到选定的区块链上'
  },
  {
    icon: <SettingsIcon fontSize="large" />,
    number: '3',
    title: '设置拍卖',
    description: '选择拍卖类型并设置起拍价'
  },
  {
    icon: <PlayArrowIcon fontSize="large" />,
    number: '4',
    title: '开始拍卖',
    description: '您的NFT将在市场上展示并开始拍卖'
  }
];

const MintSteps: React.FC = () => {
  return (
    <Grid container spacing={4}>
      {steps.map((step, index) => (
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 3
        }} key={index}>
          <Box 
            className="text-center p-6 rounded-lg relative"
            sx={{
              '&:not(:last-child)::after': {
                content: '""',
                position: 'absolute',
                top: '30%',
                right: '-5%',
                width: '10%',
                height: '2px',
                bgcolor: 'primary.main',
                display: { xs: 'none', md: 'block' }
              }
            }}
          >
            <Box 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              sx={{ bgcolor: 'primary.main', color: 'white' }}
            >
              {step.icon}
            </Box>
            <Typography variant="h6" className="mb-2">
              {step.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {step.description}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
} 

export default MintSteps;