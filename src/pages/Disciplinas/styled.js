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

export const DisciplinasTableWrapper = styled.div`
    overflow-x: auto;

    table {
        margin: 0;
    }
`;
