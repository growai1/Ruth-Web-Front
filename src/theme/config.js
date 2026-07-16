import { theme } from 'antd';
import { neonTokens } from './tokens';

export const getAntdTheme = (mode) => {
  const tokens = neonTokens[mode];
  return {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: tokens.colorPrimary,
      colorInfo: tokens.colorInfo,
      colorSuccess: tokens.colorSuccess,
      colorWarning: tokens.colorWarning,
      colorError: tokens.colorError,
      colorBgContainer: tokens.colorBgCardSolid,
      colorBgBase: tokens.colorBgBase,
      colorBgLayout: tokens.colorBgBase,
      colorBgElevated: tokens.colorBgElevated,
      colorText: tokens.colorText,
      colorTextSecondary: tokens.colorTextSecondary,
      colorBorder: tokens.colorBorder,
      colorBorderSecondary: tokens.colorBorder,
      colorSplit: tokens.colorBorder,
      borderRadius: tokens.borderRadius,
      borderRadiusLG: tokens.borderRadiusLG,
      fontFamily: tokens.fontFamily,
      colorLink: tokens.colorPrimary,
      colorLinkHover: tokens.colorPrimaryHover,
      colorLinkActive: tokens.colorPrimaryActive,
      controlHeight: 44,
      controlHeightLG: 52,
      motionDurationMid: '0.25s',
      motionDurationSlow: '0.4s',
      motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    components: {
      Button: {
        borderRadius: 16,
        controlHeight: 44,
        controlHeightLG: 52,
        fontWeight: 700,
      },
      Card: {
        borderRadiusLG: tokens.borderRadiusLG,
        colorBgContainer: tokens.colorBgCardSolid,
      },
      Input: {
        borderRadius: 16,
        controlHeight: 44,
        colorBgContainer: tokens.colorBgBase,
        activeBorderColor: tokens.colorPrimary,
        hoverBorderColor: tokens.colorPrimaryHover,
        activeShadow: tokens.glowSoft,
      },
      Select: {
        borderRadius: 16,
        controlHeight: 44,
        optionSelectedBg: mode === 'dark' ? 'rgba(139, 195, 74, 0.1)' : 'rgba(104, 159, 56, 0.1)',
      },
      Layout: {
        siderBg: 'transparent',
        headerBg: 'transparent',
        bodyBg: tokens.colorBgBase,
      },
      Menu: {
        itemBorderRadius: 16,
        itemMarginInline: 8,
        itemSelectedBg: mode === 'dark' ? 'rgba(139, 195, 74, 0.12)' : 'rgba(104, 159, 56, 0.12)',
        itemSelectedColor: tokens.colorPrimary,
        itemHoverBg: mode === 'dark' ? 'rgba(139, 195, 74, 0.06)' : 'rgba(104, 159, 56, 0.06)',
        itemColor: tokens.colorTextSecondary,
        itemHoverColor: tokens.colorPrimary,
        iconSize: 18,
      },
      Modal: {
        contentBg: tokens.colorBgCardSolid,
        headerBg: tokens.colorBgCardSolid,
        titleColor: tokens.colorText,
        borderRadiusLG: tokens.borderRadiusXL,
      },
      Skeleton: {
        color: tokens.colorBgElevated,
        colorEnd: tokens.colorBgSurface,
      },
      Tag: {
        borderRadiusSM: 10,
      },
      Notification: {
        colorBgElevated: tokens.colorBgCardSolid,
      },
      Statistic: {
        titleColor: tokens.colorTextSecondary,
        contentFontSize: 36,
      },
      Tabs: {
        inkBarColor: tokens.colorPrimary,
        itemSelectedColor: tokens.colorPrimary,
        itemHoverColor: tokens.colorPrimaryHover,
      },
      Switch: {
        colorPrimary: tokens.colorPrimary,
      },
      Progress: {
        defaultColor: tokens.colorPrimary,
        remainingColor: tokens.colorBgElevated,
      },
      Upload: {
        borderRadius: 20,
      },
    },
  };
};
