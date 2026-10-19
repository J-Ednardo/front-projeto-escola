import styled from 'styled-components';
import { colors, metrics } from '../../styles/theme';

export const AuthWrapper = styled.div`
    flex: 1;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    background: radial-gradient(circle at 50% 0%, #EFF6FF 0%, ${colors.background} 60%);
`;

export const AuthCard = styled.div`
    width: 100%;
    max-width: 440px;
    background: #FFFFFF;
    border-radius: ${metrics.borderRadiusLg};
    border: 1px solid ${colors.border};
    box-shadow: ${metrics.boxShadowLg};
    padding: 40px;

    .card-header {
        text-align: center;
        margin-bottom: 32px;

        .brand-badge {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
            color: #FFFFFF;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            box-shadow: 0 8px 16px rgba(37, 99, 235, 0.25);
        }

        h1 {
            font-size: 24px;
            font-weight: 700;
            color: ${colors.textTitle};
            margin-bottom: 8px;
        }

        .subtitle {
            font-size: 14px;
            color: ${colors.textBody};
            line-height: 1.5;
        }
    }

    .card-footer {
        margin-top: 28px;
        padding-top: 20px;
        border-top: 1px solid ${colors.borderLight};
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 14px;
        color: ${colors.textBody};

        a {
            font-weight: 600;
        }
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;

    label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-weight: 600;
        font-size: 13px;
        color: ${colors.textTitle};
    }

    button[type="submit"] {
        margin-top: 8px;
        width: 100%;
        height: 46px;
        font-size: 15px;
    }
`;

export const InputGroup = styled.div`
    position: relative;
    display: flex;
    align-items: center;

    .input-icon {
        position: absolute;
        left: 14px;
        color: ${colors.textMuted};
        font-size: 15px;
        pointer-events: none;
    }

    input {
        width: 100%;
        padding-left: 42px;
    }
`;