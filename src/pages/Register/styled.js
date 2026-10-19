import styled from 'styled-components';
import { colors, metrics } from '../../styles/theme';

export const RegisterWrapper = styled.div`
    flex: 1;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    background: radial-gradient(circle at 50% 0%, #EFF6FF 0%, ${colors.background} 60%);
`;

export const Card = styled.div`
    width: 100%;
    max-width: 480px;
    background: #FFFFFF;
    border-radius: ${metrics.borderRadiusLg};
    border: 1px solid ${colors.border};
    box-shadow: ${metrics.boxShadowLg};
    padding: 40px;

    .card-header {
        text-align: center;
        margin-bottom: 28px;

        .brand-badge {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
            color: #FFFFFF;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 14px;
            box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);
        }

        h1 {
            font-size: 22px;
            font-weight: 700;
            color: ${colors.textTitle};
            margin-bottom: 6px;
        }

        .subtitle {
            font-size: 13px;
            color: ${colors.textBody};
            line-height: 1.5;
        }
    }

    .card-footer {
        margin-top: 24px;
        padding-top: 18px;
        border-top: 1px solid ${colors.borderLight};
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 13px;
        color: ${colors.textBody};

        a {
            font-weight: 600;
        }
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 18px;

    label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-weight: 600;
        font-size: 13px;
        color: ${colors.textTitle};
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
        font-size: 14px;
        pointer-events: none;
    }

    input {
        width: 100%;
        padding-left: 40px;
    }
`;

export const ActionRow = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 10px;

    button[type="submit"] {
        flex: 1;
        height: 46px;
        font-size: 14px;
    }

    .danger-btn {
        background: ${colors.errorBg};
        color: ${colors.error};
        border: 1px solid ${colors.errorBorder};
        box-shadow: none;

        &:hover {
            background: ${colors.error};
            color: #FFFFFF;
            border-color: ${colors.error};
        }
    }
`;
