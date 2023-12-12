import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Client } from '@twilio/conversations';

import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../../utils/error";
import { ChatItem, Button, Input, MessageList } from 'react-chat-elements';
import { IoMdSend } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { Container } from 'react-bootstrap';
import LoadingBox from './LoadingBox'
import axios from "../../utils/axios";
import ReactPlaceholder from 'react-placeholder';

const LIST = 'MULTIPLE_MESSAGE';
const OBJ = 'SINGLE_MESSAGE';

const readFileAsBlob = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const arrayBuffer = reader.result;
      const blob = new Blob([arrayBuffer], { type: file.type });
      resolve(blob);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

const Chat = () => {
  const { user, token } = useSelector((state) => state.auth);

  // TWILIO CLIENT
  const [client, setClient] = useState();
  const [convSID, setConvSID] = useState();
  const [conversation, setConversation] = useState();
  console.log({ client, convSID });

  const [loadingMsg, setLoadingMsg] = useState(false);
  const [messages, setMessages] = useState([]);

  const getFormattedMsg = async (message) => {
    const { body, attributes, author, media, type, timestamp } = message.state;
    console.log({ body, attributes, author, media, type, timestamp })

    const obj = {
      position: author === user?._id ? "right" : "left",
      type: 'text',
      text: body,
      title: author === user?._id ? user.username : 'Admin',
      date: new Date(timestamp)
    }
    if (media && type === 'media') {
      const { contentType, filename } = media.state;
      const cType = contentType.split('/')[0] === 'image' ? 'photo' : 'file';

      console.log({ filename, contentType, cType });
      const uri = await media.getContentTemporaryUrl();

      return {
        ...obj,
        type: cType,
        text: cType === 'photo' ? '' : filename,
        data: {
          uri,
          status: { click: false, loading: 0 }
        }
      }
    }

    return obj;
  }

  const formatMessage = async (msgList, instaneType) => {
    console.log({ msgList, instaneType })

    switch (instaneType) {
      case LIST:
        return !msgList || msgList.length === 0 ? [] : await Promise.all(msgList.map(async (msg) => await getFormattedMsg(msg)));

      case OBJ:
        return await getFormattedMsg(msgList);

      default:
        toast.error("Something Went Wrong", toastOptions);
        break;
    }
  };

  useEffect(() => {
    if (client && convSID) {
      (async () => {
        const conv = await client.getConversationBySid(convSID);

        setLoadingMsg(true);
        const convMessage = await conv.getMessages();
        const formattedMsgList = await formatMessage(convMessage.items, LIST);
        setMessages(formattedMsgList);
        setConversation(conv);
        setLoadingMsg(false);
        console.log({ conv, convMessage, formattedMsgList });
      })();
    }
  }, [client, convSID]);



  const inputRef = useRef(null);
  const inputFileRef = useRef(null);
  const messageBoxRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState();
  const [inputValue, setInputValue] = useState();
  console.log({ chat, user })

  useEffect(() => {
    const handleNewMessage = async (message) => {
      const formattedMsg = await formatMessage(message, OBJ);
      console.log("messageAdded event", { message, formattedMsg });
      setMessages((prev) => [...prev, formattedMsg]);
    };

    if (conversation) {
      console.log("Attaching messageAdded event handler");
      conversation.on('messageAdded', handleNewMessage);
    }

    return () => {
      // Clean up the event handler when the component unmounts
      if (conversation) {
        console.log("Detaching messageAdded event handler");
        conversation.off('messageAdded', handleNewMessage);
      }
    };
  }, [conversation]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/chat/access-token`,
          { headers: { Authorization: token } }
        );

        console.log({ data })
        if (data.access_token) {
          let twiClient = new Client(data.access_token);
          twiClient.on('initialized', () => {
            console.log("Client Initialized");
            setClient(twiClient);
          })
          twiClient.on('initFailed', (error) => {
            toast.error(error.message, toastOptions);
          })
          twiClient.on("tokenAboutToExpire", async (time) => {
            try {
              const res = await axios.get(
                `/api/chat/access-token`,
                { headers: { Authorization: token } }
              );

              twiClient = await twiClient.updateToken(res.data.access_token)
            } catch (error) {
              toast.error(error.message, toastOptions);
            }
          });

          const allConv = await twiClient.getSubscribedConversations();
          const allUsers = await twiClient.getSubscribedUsers();
          console.log({ allConv, allUsers })
          setChat(data.chat);
          setConvSID(data.chat.conversationSID);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.error.message, toastOptions);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    inputRef.current.value = '';
    inputRef.current.focus();

    if (!inputValue) {
      return;
    }
    console.log({ t: typeof inputValue, inputValue })
    try {
      inputFileRef.current.value = '';
      if (typeof inputValue === 'object') {
        const sentMediaMsg = await conversation.prepareMessage().addMedia(inputValue).setAttributes({ authorName: user?.username, content_type: inputValue.contentType }).build().send();
        console.log({ sentMediaMsg })
      } else {
        await conversation.sendMessage(inputValue, {
          authorName: user?.username
        })

        const unread = await conversation.getUnreadMessagesCount();
        const msg = await conversation.getMessages();
        console.log({ msg, unread });
      }
      setInputValue('');

    } catch (err) {
      toast.error(err.response.data.error.message, toastOptions);
    }
  };

  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      try {
        const fileBlob = await readFileAsBlob(selectedFile);
        console.log({ fileBlob })
        // Send the media message
        setInputValue({
          contentType: selectedFile.type,
          filename: selectedFile.name,
          media: fileBlob,
        });
        inputRef.current.value = selectedFile.name;

      } catch (error) {
        console.error('Error preparing message:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      // Your logic to send the message
      sendMessage();
    }
  };

  const onDownLoad = ({ data }) => {
    // console.log({ data, url: data.uri }, "file download");
    const anchorlink = document.createElement("a");
    anchorlink.href = data.uri;
    anchorlink.setAttribute("download", 'file.pdf');
    anchorlink.click();
  };

  console.log({ messages })
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <ReactPlaceholder
        type="media"
        color="#F0F0F0"
        showLoadingAnimation
        rows={7}
        ready={!loading}
      >
        <Container className='chat-container'>
          <div className='h-100 d-flex flex-column justify-content-between'>
            <ChatItem
              avatar={''}
              alt={'Reactjs'}
              title='Customer Care'
            />

            <div className='msg-box' ref={messageBoxRef}>
              {loadingMsg ? <LoadingBox /> : <MessageList
                className='message-list'
                lockable={true}
                toBottomHeight={'100%'}
                onDownload={onDownLoad}
                dataSource={messages} />}
            </div>

            <div className='d-flex align-items-center p-2' style={{ position: 'relative', backgroundColor: '#fff' }}>
              <div>
                <label htmlFor="file-input" className='rce-button'>
                  <ImAttachment size={20} />
                </label>
                <input type='file' id='file-input' style={{ display: 'none' }} ref={inputFileRef} onChange={fileChangeHandler} onKeyPress={sendMessage} />
              </div>
              <div style={{ width: '100%' }}>
                <Input
                  placeholder='Type here...'
                  referance={inputRef}
                  autofocus={true}
                  multiline={true}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.trim())}
                  onKeyPress={handleKeyPress}
                  rightButtons={
                    <Button
                      onClick={sendMessage}
                      title="Send"
                      icon={{
                        float: 'right',
                        size: 20,
                        component: <IoMdSend />
                      }}
                    />
                  }
                />
              </div>
            </div>
          </div>
        </Container>
      </ReactPlaceholder>
      <ToastContainer />
    </motion.div>
  )
};

export default Chat;