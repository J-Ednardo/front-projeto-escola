import styled from 'styled-components';
import { colors, metrics } from '../../styles/theme';

export const Nav = styled.nav`
    background: ${colors.sidebarBg};
    width: ${metrics.sidebarWidth};
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
    position: sticky;
    top: 0;

    a {
        color: ${colors.sidebarIcon};
        margin-bottom: 30px;
        font-size: 24px;
        transition: all 0.3s;
        
        &:hover {
            color: ${colors.sidebarIconActive};
            transform: scale(1.1);
        }
    }

    .logo {
        color: ${colors.primary};
        font-size: 32px;
        margin-bottom: 60px;
    }
`;
