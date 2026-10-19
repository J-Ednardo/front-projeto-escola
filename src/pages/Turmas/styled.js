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
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) auto;
        gap: 12px;
        align-items: center;

        button[type="submit"] {
            height: 44px;
            white-space: nowrap;
        }

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }
`;

export const TurmasGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
    margin-top: 20px;
`;

export const TurmaCard = styled.div`
    background: #FFFFFF;
    border: 1px solid ${colors.border};
    border-radius: ${metrics.borderRadius};
    padding: 20px;
    box-shadow: ${metrics.boxShadowSm};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${metrics.boxShadow};
        border-color: #BFDBFE;
    }

    .turma-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;

        .turma-badge {
            font-size: 12px;
            font-weight: 700;
            background: #EFF6FF;
            color: ${colors.primary};
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid #DBEAFE;
        }

        .periodo-pill {
            font-size: 11px;
            font-weight: 600;
            color: ${colors.textMuted};
            background: #F1F5F9;
            padding: 3px 8px;
            border-radius: 4px;
        }
    }

    .disciplina-nome {
        font-size: 16px;
        font-weight: 700;
        color: ${colors.textTitle};
        margin-bottom: 8px;
    }

    .meta-info {
        font-size: 13px;
        color: ${colors.textBody};
        margin-bottom: 18px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        span {
            display: flex;
            align-items: center;
            gap: 6px;
        }
    }
`;

export const DiarioLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: ${colors.primary};
    color: #FFFFFF;
    height: 40px;
    border-radius: ${metrics.borderRadiusSm};
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s ease;
    text-decoration: none;

    &:hover {
        background: ${colors.primaryDark};
        color: #FFFFFF;
        transform: translateY(-1px);
    }

    &:active {
        transform: scale(0.98);
    }
`;
