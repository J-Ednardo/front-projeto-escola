import styled from 'styled-components';
import { colors, metrics } from '../../styles/theme';

export const UploadBox = styled.div`
    max-width: 480px;
    margin: 40px auto;
    text-align: center;
    background: #FFFFFF;
    border-radius: ${metrics.borderRadiusLg};
    padding: 32px;
    border: 1px solid ${colors.border};
    box-shadow: ${metrics.boxShadowSm};

    .upload-icon {
        color: ${colors.primary};
        margin-bottom: 12px;
    }

    h1 {
        font-size: 22px;
        font-weight: 700;
        color: ${colors.textTitle};
        margin-bottom: 6px;
    }

    p {
        font-size: 13px;
        color: ${colors.textBody};
        margin-bottom: 24px;
    }
`;

export const Title = styled.h1`
    text-align: center;
`;

export const Form = styled.form`
    label {
        height: 180px;
        width: 180px;
        display: flex;
        flex-direction: column;
        background: #F8FAFC;
        border: 2px dashed ${colors.primary};
        margin: 20px auto;
        cursor: pointer;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        color: ${colors.primary};
        font-weight: 600;
        font-size: 14px;
        box-shadow: ${metrics.boxShadowSm};

        &:hover {
            border-color: ${colors.primaryDark};
            background: #EFF6FF;
            transform: scale(1.03);
        }
    }

    img {
        height: 180px;
        width: 180px;
        object-fit: cover;
    }
    
    input {
        display: none;
    }
`;
