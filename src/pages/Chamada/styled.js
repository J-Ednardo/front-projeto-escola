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

export const NoticeAlert = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    background: ${props => props.$variant === 'danger' ? '#FEF2F2' : colors.warningBg};
    color: ${props => props.$variant === 'danger' ? '#991B1B' : colors.warning};
    border: 1px solid ${props => props.$variant === 'danger' ? '#FCA5A5' : colors.warningBorder};
    padding: 14px 18px;
    border-radius: ${metrics.borderRadiusSm};
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 600;
`;

export const LessonCard = styled.div`
    background: #F8FAFC;
    border: 1px solid ${colors.border};
    border-radius: ${metrics.borderRadius};
    padding: 20px 24px;
    margin-bottom: 24px;

    .fields-row {
        display: flex;
        gap: 16px;

        @media (max-width: 640px) {
            flex-direction: column;
        }
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: ${colors.textTitle};
    }
`;

export const AttendanceTableWrapper = styled.div`
    overflow-x: auto;
    margin-bottom: 24px;

    table {
        margin: 0;
    }

    .aluno-cell {
        font-weight: 600;
        color: ${colors.textTitle};

        .matricula-id {
            font-size: 12px;
            font-weight: 500;
            color: ${colors.textMuted};
            margin-left: 6px;
        }
    }
`;

export const ToggleButton = styled.button`
    height: 36px;
    padding: 0 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    width: 120px;
    margin: 0 auto;

    &.presente {
        background: ${colors.successBg};
        color: ${colors.success};
        border: 1px solid ${colors.successBorder};
        box-shadow: none;

        &:hover:not(:disabled) {
            background: #D1FAE5;
        }
    }

    &.falta {
        background: ${colors.errorBg};
        color: ${colors.error};
        border: 1px solid ${colors.errorBorder};
        box-shadow: none;

        &:hover:not(:disabled) {
            background: #FEE2E2;
        }
    }
`;

export const SaveButton = styled.button`
    width: 100%;
    height: 48px;
    font-size: 15px;
    font-weight: 600;
    margin-top: 8px;

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        background: #94A3B8;
        border-color: #94A3B8;
        box-shadow: none;
    }
`;

export const AulasAnterioresSection = styled.div`
    margin-top: 40px;
    padding-top: 28px;
    border-top: 1px solid ${colors.borderLight};

    h2 {
        font-size: 18px;
        font-weight: 700;
        color: ${colors.textTitle};
        margin-bottom: 16px;
    }

    table {
        margin: 0;
    }
`;
