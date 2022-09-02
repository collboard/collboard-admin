import { styled } from '@collboard/modules-sdk';

export const MessageApiStyle = styled.div`
    display: flex;
    align-items: end;
    justify-content: end;
    flex-flow: column;

    .request,
    .response {
        width: 100%;
        height: 250px;
        outline: none;
    }

    .request {
        border: 1px solid blue;
        resize: none;
    }

    .response {
        border: 1px solid green;
    }

    .button {
        margin: none;
    }
`;
