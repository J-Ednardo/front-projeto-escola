import styled from 'styled-components';
import { colors, metrics } from '../../styles/theme';

export const HeaderBox = styled.div`
    text-align: center;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid ${colors.borderLight};

    .document-tag {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: ${colors.primary};
        background: #EFF6FF;
        padding: 4px 12px;
        border-radius: 20px;
        border: 1px solid #DBEAFE;
        margin-bottom: 10px;
    }

    h1 {
        font-size: 24px;
        font-weight: 800;
        color: ${colors.textTitle};
        margin-bottom: 6px;
    }

    .student-name {
        font-size: 16px;
        color: ${colors.textBody};
        font-weight: 500;
    }
`;

export const KpiGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 36px;
`;

export const KpiCard = styled.div`
    background: #FFFFFF;
    border: 1px solid ${colors.border};
    border-radius: ${metrics.borderRadius};
    padding: 20px 24px;
    box-shadow: ${metrics.boxShadowSm};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    .kpi-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 700;
        color: ${colors.textMuted};
        margin-bottom: 8px;
    }

    .kpi-value {
        font-size: 32px;
        font-weight: 800;
        letter-spacing: -0.03em;
        font-variant-numeric: tabular-nums;
        line-height: 1;

        &.primary {
            color: ${colors.primary};
        }

        &.success {
            color: ${colors.success};
        }
    }
`;

export const PeriodoBlock = styled.div`
    margin-bottom: 32px;

    .periodo-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 2px solid ${colors.primary};

        h3 {
            font-size: 16px;
            font-weight: 700;
            color: ${colors.textTitle};
            margin: 0;
        }

        .periodo-tag {
            font-size: 11px;
            font-weight: 700;
            background: #EFF6FF;
            color: ${colors.primary};
            padding: 2px 8px;
            border-radius: 4px;
        }
    }

    table {
        margin: 0;
    }
`;

export const StatusPill = styled.span`
    display: inline-block;
    padding: 3px 9px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;

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
