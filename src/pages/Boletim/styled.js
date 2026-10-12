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

    @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }
`;

export const DownloadPdfButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #FFFFFF;
    color: ${colors.textTitle};
    border: 1px solid ${colors.border};
    padding: 0 18px;
    height: 42px;
    border-radius: ${metrics.borderRadiusSm};
    font-size: 14px;
    font-weight: 600;
    box-shadow: ${metrics.boxShadowSm};

    &:hover {
        background: #F8FAFC;
        border-color: ${colors.primary};
        color: ${colors.primary};
        transform: translateY(-1px);
    }
`;

export const StudentBanner = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    background: #F8FAFC;
    border: 1px solid ${colors.border};
    border-radius: ${metrics.borderRadius};
    padding: 16px 20px;
    margin-bottom: 24px;

    .student-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #EFF6FF;
        color: ${colors.primary};
        font-weight: 700;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #DBEAFE;
    }

    .student-details {
        h3 {
            font-size: 16px;
            font-weight: 700;
            color: ${colors.textTitle};
            margin-bottom: 2px;
        }

        p {
            font-size: 13px;
            color: ${colors.textBody};
            margin: 0;
        }
    }
`;

export const BoletimTable = styled.table`
    margin: 0;
    
    th, td {
        text-align: center;
    }

    th:first-child, td:first-child {
        text-align: left;
    }

    th:nth-child(2), td:nth-child(2) {
        text-align: left;
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
