import styled from 'styled-components';
import { colors, metrics } from '../../styles/theme';

export const ErrorBox = styled.div`
    max-width: 480px;
    margin: 60px auto;
    text-align: center;
    background: #FFFFFF;
    border-radius: ${metrics.borderRadiusLg};
    padding: 48px 32px;
    border: 1px solid ${colors.border};
    box-shadow: ${metrics.boxShadow};

    .error-code {
        font-size: 72px;
        font-weight: 800;
        letter-spacing: -0.04em;
        color: ${colors.primary};
        line-height: 1;
        margin-bottom: 16px;
    }

    h1 {
        font-size: 22px;
        font-weight: 700;
        color: ${colors.textTitle};
        margin-bottom: 12px;
    }

    p {
        font-size: 14px;
        color: ${colors.textBody};
        margin-bottom: 28px;
        line-height: 1.5;
    }

    a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: ${colors.primary};
        color: #FFFFFF;
        padding: 0 24px;
        height: 44px;
        border-radius: ${metrics.borderRadiusSm};
        font-weight: 600;
        font-size: 14px;
        box-shadow: ${metrics.boxShadowSm};

        &:hover {
            background: ${colors.primaryDark};
            color: #FFFFFF;
            transform: translateY(-1px);
        }
    }
`;
