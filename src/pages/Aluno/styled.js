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

export const ProfilePicture = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0 24px;
    position: relative;

    .avatar-wrapper {
        position: relative;
        width: 140px;
        height: 140px;
    }

    img {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #FFFFFF;
        box-shadow: ${metrics.boxShadowLg};
    }

    .placeholder-icon {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: #F1F5F9;
        color: ${colors.textMuted};
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4px solid #FFFFFF;
        box-shadow: ${metrics.boxShadow};
    }

    a {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 4px;
        right: 4px;
        color: #FFFFFF;
        background: ${colors.primary};
        width: 38px;
        height: 38px;
        border-radius: 50%;
        box-shadow: ${metrics.boxShadow};
        transition: all 0.2s ease;
        border: 2px solid #FFFFFF;

        &:hover {
            transform: scale(1.1);
            background: ${colors.primaryDark};
            color: #FFFFFF;
        }
    }
`;

export const Form = styled.form`
    max-width: 640px;
    margin: 0 auto;

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 24px;

        @media (max-width: 640px) {
            grid-template-columns: 1fr;
        }
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-weight: 600;
        font-size: 13px;
        color: ${colors.textTitle};
    }

    button[type="submit"] {
        width: 100%;
        height: 48px;
        font-size: 15px;
    }
`;
