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

export const TableWrapper = styled.div`
    overflow-x: auto;

    table {
        margin: 0;
    }
`;

export const RoleBadge = styled.span`
    display: inline-block;
    padding: 3px 9px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;

    &.admin {
        background: #EFF6FF;
        color: ${colors.primary};
        border: 1px solid #BFDBFE;
    }

    &.professor {
        background: #F0FDF4;
        color: #16A34A;
        border: 1px solid #BBF7D0;
    }

    &.aluno {
        background: #FAF5FF;
        color: #9333EA;
        border: 1px solid #E9D5FF;
    }

    &.user {
        background: #F1F5F9;
        color: ${colors.textBody};
        border: 1px solid ${colors.border};
    }
`;

export const ActionButton = styled.button`
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 6px;
    transition: all 0.2s ease;

    &.edit {
        background: #F1F5F9;
        color: ${colors.textBody};
        border: 1px solid ${colors.border};
        box-shadow: none;

        &:hover {
            background: #EFF6FF;
            color: ${colors.primary};
            border-color: #BFDBFE;
        }
    }

    &.save {
        background: ${colors.successBg};
        color: ${colors.success};
        border: 1px solid ${colors.successBorder};
        box-shadow: none;

        &:hover {
            background: ${colors.success};
            color: #FFFFFF;
        }
    }

    &.cancel {
        background: ${colors.errorBg};
        color: ${colors.error};
        border: 1px solid ${colors.errorBorder};
        box-shadow: none;

        &:hover {
            background: ${colors.error};
            color: #FFFFFF;
        }
    }
`;

export const PaginationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid ${colors.borderLight};

    button {
        padding: 0 16px;
        height: 38px;
        font-size: 13px;
        background: #FFFFFF;
        color: ${colors.textTitle};
        border: 1px solid ${colors.border};
        box-shadow: ${metrics.boxShadowSm};

        &:hover:not(:disabled) {
            background: #F8FAFC;
            border-color: ${colors.primary};
            color: ${colors.primary};
        }

        &:disabled {
            background: #F8FAFC;
            color: ${colors.textMuted};
            border-color: ${colors.borderLight};
            cursor: not-allowed;
            box-shadow: none;
        }
    }

    span {
        font-weight: 600;
        font-size: 13px;
        color: ${colors.textBody};
    }
`;
