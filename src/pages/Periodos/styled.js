import styled from 'styled-components';
import { colors, metrics } from '../../styles/theme';

export const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid ${colors.borderLight};

    .subtitle {
        font-size: 14px;
        color: ${colors.textBody};
        margin-top: 4px;
    }
`;

export const FormCard = styled.div`
    background: #F8FAFC;
    border: 1px solid ${colors.border};
    border-radius: ${metrics.borderRadius};
    padding: 20px 24px;
    margin-bottom: 28px;

    h3 {
        font-size: 15px;
        font-weight: 600;
        color: ${colors.textTitle};
        margin-bottom: 16px;
    }

    form {
        display: flex;
        gap: 12px;
        align-items: center;

        input {
            flex: 1;
        }

        button[type="submit"] {
            height: 44px;
            white-space: nowrap;
        }

        @media (max-width: 640px) {
            flex-direction: column;
            align-items: stretch;
        }
    }
`;

export const StatusPill = styled.span`
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;

    &.aberto {
        background: ${colors.successBg};
        color: ${colors.success};
        border: 1px solid ${colors.successBorder};
    }

    &.fechado {
        background: ${colors.errorBg};
        color: ${colors.error};
        border: 1px solid ${colors.errorBorder};
    }
`;

export const ActionButton = styled.button`
    height: 34px;
    padding: 0 14px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 6px;
    transition: all 0.2s ease;

    &.encerrar {
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

    &.reabrir {
        background: ${colors.successBg};
        color: ${colors.success};
        border: 1px solid ${colors.successBorder};
        box-shadow: none;

        &:hover {
            background: ${colors.success};
            color: #FFFFFF;
            border-color: ${colors.success};
        }
    }
`;
