import styled from 'styled-components';
import { colors, metrics } from '../../styles/theme';

export const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    background: #F8FAFC;
    border-radius: ${metrics.borderRadius};
    border: 1px dashed ${colors.border};
    margin: 24px 0;

    .icon-wrapper {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #EFF6FF;
        color: ${colors.primary};
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
    }

    h3 {
        font-size: 16px;
        font-weight: 600;
        color: ${colors.textTitle};
        margin-bottom: 6px;
    }

    p {
        font-size: 14px;
        color: ${colors.textBody};
        max-width: 400px;
        line-height: 1.5;
        margin-bottom: 0;
    }

    .action-wrapper {
        margin-top: 18px;
    }
`;
