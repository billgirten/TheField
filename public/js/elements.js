export const getIncomingCallDialog = (callTypeInfo, acceptCallHandler, rejectCallHandler) => {
    const dialog = document.createElement('div');
    dialog.classList.add('dialog_wrapper');

    const dialogContent = document.createElement('div');
    dialogContent.classList.add('dialog_content');
    dialog.appendChild(dialogContent);

    const dialogTitle = document.createElement('p');
    dialogTitle.classList.add('dialog_title');
    dialogTitle.innerHTML = `Incoming ${callTypeInfo} Call`

    const dialogImageContainer = document.createElement('div');
    dialogImageContainer.classList.add('dialog_image_container');
    const dialogImage = document.createElement('img');
    dialogImage.src = './utils/images/dialogAvatar.png';
    dialogImageContainer.appendChild(dialogImage);

    const dialogButtonContainer = document.createElement('div');
    dialogButtonContainer.classList.add('dialog_button_container');
    const dialogAcceptCallButton = document.createElement('button');
    dialogAcceptCallButton.classList.add('dialog_accept_call_button');
    const dialogAcceptCallImage = document.createElement('img');
    dialogAcceptCallImage.classList.add('dialog_button_image');
    dialogAcceptCallImage.src = './utils/images/acceptCall.png';
    dialogAcceptCallButton.appendChild(dialogAcceptCallImage);
    dialogButtonContainer.appendChild(dialogAcceptCallButton);

    const dialogRejectCallButton = document.createElement('button');
    dialogRejectCallButton.classList.add('dialog_reject_call_button');
    const dialogRejectCallImage = document.createElement('img');
    dialogRejectCallImage.classList.add('dialog_button_image');
    dialogRejectCallImage.src = './utils/images/rejectCall.png';
    dialogRejectCallButton.appendChild(dialogRejectCallImage);
    dialogButtonContainer.appendChild(dialogRejectCallButton);

    dialogContent.appendChild(dialogTitle);
    dialogContent.appendChild(dialogImageContainer);
    dialogContent.appendChild(dialogButtonContainer);

    const dialogHTML = document.querySelector('#dialog');
    dialogHTML.appendChild(dialog)

    dialogAcceptCallButton.addEventListener('click', () => {
        acceptCallHandler();
    });

    dialogRejectCallButton.addEventListener('click', () => {
        rejectCallHandler();
    });

    return dialog;
};


export const getOutgoingCallDialog = rejectCallHandler => {
    const dialog = document.createElement('div');
    dialog.classList.add('dialog_wrapper');

    const dialogContent = document.createElement('div');
    dialogContent.classList.add('dialog_content');
    dialog.appendChild(dialogContent);

    const dialogTitle = document.createElement('p');
    dialogTitle.classList.add('dialog_title');
    dialogTitle.innerHTML = `Calling`

    const dialogImageContainer = document.createElement('div');
    dialogImageContainer.classList.add('dialog_image_container');
    const dialogImage = document.createElement('img');
    dialogImage.src = './utils/images/dialogAvatar.png';
    dialogImageContainer.appendChild(dialogImage);

    const dialogButtonContainer = document.createElement('div');
    dialogButtonContainer.classList.add('dialog_button_container');
    const dialogHangUpCallButton = document.createElement('button');
    dialogHangUpCallButton.classList.add('dialog_reject_call_button');
    const dialogHangUpCallImage = document.createElement('img');
    dialogHangUpCallImage.classList.add('dialog_button_image');
    dialogHangUpCallImage.src = './utils/images/rejectCall.png';
    dialogHangUpCallButton.appendChild(dialogHangUpCallImage);
    dialogButtonContainer.appendChild(dialogHangUpCallButton);

    dialogContent.appendChild(dialogTitle);
    dialogContent.appendChild(dialogImageContainer);
    dialogContent.appendChild(dialogButtonContainer);

    const dialogHTML = document.querySelector('#dialog');
    dialogHTML.appendChild(dialog)

    dialogHangUpCallButton.addEventListener('click', () => {
        rejectCallHandler();
    });

    return dialog;
};

export const getInfoDialog = (infoTitle, infoContent) => {
    const dialog = document.createElement('div');
    dialog.classList.add('dialog_wrapper');

    const dialogContent = document.createElement('div');
    dialogContent.classList.add('dialog_content');
    dialog.appendChild(dialogContent);

    const dialogTitle = document.createElement('p');
    dialogTitle.classList.add('dialog_title');
    dialogTitle.innerHTML = infoTitle;

    const dialogImageContainer = document.createElement('div');
    dialogImageContainer.classList.add('dialog_image_container');
    const dialogImage = document.createElement('img');
    dialogImage.src = './utils/images/dialogAvatar.png';
    dialogImageContainer.appendChild(dialogImage);

    const dialogInfoContainer = document.createElement('p');
    dialogInfoContainer.classList.add('dialog_description');
    dialogInfoContainer.innerHTML = infoContent;

    dialogContent.appendChild(dialogTitle);
    dialogContent.appendChild(dialogImageContainer);
    dialogContent.appendChild(dialogInfoContainer);

    const dialogHTML = document.querySelector('#dialog');
    dialogHTML.appendChild(dialog)

    return dialog;
};

export const getLeftMessage = message => {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message_left_container');
    const messageParagraph = document.createElement('p');
    messageParagraph.classList.add('message_left_paragraph');
    messageParagraph.innerHTML = message;
    messageContainer.appendChild(messageParagraph);
    return messageContainer;
};

export const getRightMessage = message => {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message_right_container');
    const messageParagraph = document.createElement('p');
    messageParagraph.classList.add('message_right_paragraph');
    messageParagraph.innerHTML = message;
    messageContainer.appendChild(messageParagraph);
    return messageContainer;
};
