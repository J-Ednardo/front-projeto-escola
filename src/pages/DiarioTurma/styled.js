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

export const ChamadaButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: ${colors.primary};
    color: #FFFFFF;
    padding: 0 20px;
    height: 42px;
    border-radius: ${metrics.borderRadiusSm};
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    text-decoration: none;
    box-shadow: ${metrics.boxShadowSm};

    &:hover {
        background: ${colors.primaryDark};
        color: #FFFFFF;
        transform: translateY(-1px);
    }
`;

export const NoticeAlert = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    background: ${colors.warningBg};
    color: ${colors.warning};
    border: 1px solid ${colors.warningBorder};
    padding: 14px 18px;
    border-radius: ${metrics.borderRadiusSm};
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 600;
`;

export const FormRow = styled.form`
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    background: #F8FAFC;
    padding: 16px 20px;
    border-radius: ${metrics.borderRadius};
    border: 1px solid ${colors.border};
    align-items: center;

    select {
        flex: 1;
    }

    button {
        height: 44px;
        white-space: nowrap;
    }

    @media (max-width: 640px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

export const TableWrapper = styled.div`
    overflow-x: auto;

    table {
        margin: 0;
    }

    th {
        white-space: nowrap;
    }
`;

export const GradeInput = styled.input`
    width: 72px;
    height: 38px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    padding: 0 4px;
    border-radius: 6px;
    border: 1px solid ${colors.border};
    background: #FFFFFF;
    transition: all 0.2s ease;

    &:focus {
        border-color: ${colors.primary};
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
    }

    &:disabled {
        background: #F8FAFC;
        color: ${colors.textMuted};
        border-color: ${colors.borderLight};
    }
`;

export const StatusPill = styled.span`
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;

    &.aprovado {
        background: ${colors.successBg};
        color: ${colors.success};
        border: 1px solid ${colors.successBorder};
    }

    &.recuperacao {
        background: ${colors.warningBg};
        color: ${colors.warning};
        border: 1px solid ${colors.warningBorder};
    }

    &.reprovado {
        background: ${colors.errorBg};
        color: ${colors.error};
        border: 1px solid ${colors.errorBorder};
    }

    &.cursando {
        background: #F1F5F9;
        color: ${colors.textBody};
        border: 1px solid ${colors.border};
    }
`;
