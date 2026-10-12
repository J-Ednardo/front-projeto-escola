import styled from 'styled-components';
import { Link } from 'react-router-dom';
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

    @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }
`;

export const AlunoContainer = styled.div`
    margin-top: 16px;
    overflow-x: auto;

    .alunos-table {
        margin: 0;
        box-shadow: none;
    }

    .aluno-name {
        font-weight: 600;
        color: ${colors.textTitle};
    }

    .aluno-email {
        color: ${colors.textBody};
        font-size: 13px;
    }
`;

export const ProfilePicture = styled.div`
    img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 4px rgba(15, 23, 42, 0.08);
    }

    .avatar-placeholder {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #EFF6FF;
        color: ${colors.primary};
        font-weight: 700;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #DBEAFE;
    }
`;

export const NovoAluno = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: ${colors.primary};
    color: #FFFFFF;
    padding: 0 18px;
    height: 42px;
    border-radius: ${metrics.borderRadiusSm};
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${metrics.boxShadowSm};

    &:hover {
        background: ${colors.primaryDark};
        color: #FFFFFF;
        transform: translateY(-1px);
        box-shadow: ${metrics.boxShadow};
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const FiltersContainer = styled.form`
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    align-items: center;
    flex-wrap: wrap;

    .search-input-wrap {
        position: relative;
        flex: 2;
        min-width: 220px;
        display: flex;
        align-items: center;

        .search-icon {
            position: absolute;
            left: 14px;
            color: ${colors.textMuted};
            font-size: 14px;
            pointer-events: none;
        }

        input {
            width: 100%;
            padding-left: 38px;
        }
    }

    select {
        flex: 1;
        min-width: 180px;
    }

    button[type="submit"] {
        padding: 0 22px;
    }

    button.clear-btn {
        background: #F1F5F9;
        color: ${colors.textBody};
        border: 1px solid ${colors.border};
        box-shadow: none;

        &:hover {
            background: #E2E8F0;
            color: ${colors.textTitle};
        }
    }
`;

export const ActionGroup = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;

    .delete-btn-invisible {
        background: ${colors.error};
        color: #FFFFFF;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        height: 32px;
        border: none;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        animation: pulse 1s infinite alternate;

        &:hover {
            background: #B91C1C;
        }
    }

    @keyframes pulse {
        from { opacity: 0.85; }
        to { opacity: 1; }
    }
`;

export const ActionButton = styled.button`
    height: 32px;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 6px;
    box-shadow: none;
    text-decoration: none;

    &.btn-secondary {
        background: #F1F5F9;
        color: ${colors.textBody};
        border: 1px solid ${colors.border};

        &:hover {
            background: #E2E8F0;
            color: ${colors.textTitle};
        }
    }

    &.btn-icon {
        width: 32px;
        padding: 0;
        background: #F8FAFC;
        color: ${colors.textBody};
        border: 1px solid ${colors.border};

        &:hover {
            background: #EFF6FF;
            color: ${colors.primary};
            border-color: #BFDBFE;
        }
    }

    &.btn-danger-soft {
        background: ${colors.errorBg};
        color: ${colors.error};
        border: 1px solid ${colors.errorBorder};

        &:hover {
            background: ${colors.error};
            color: #FFFFFF;
            border-color: ${colors.error};
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