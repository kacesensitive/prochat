import { useEffect, useState } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useSearchParams,
  Link,
  useNavigate,
} from 'react-router-dom';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Input,
  Modal,
  Slider,
  Tooltip,
} from 'antd';
import tmi from 'tmi.js';
import './App.css';
import { Message } from 'types/Messages';
import { EmoteOptions, parse } from 'simple-tmi-emotes';
import { SketchPicker } from 'react-color';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import ReactGPicker from 'react-gcolor-picker';
import {
  IoIosArrowDropdown,
  IoMdArrowDropdownCircle,
  IoMdInformationCircleOutline,
} from 'react-icons/io';
import { MdSettingsApplications, MdPowerSettingsNew } from 'react-icons/md';
import Autolinker from 'autolinker';
import {
  filterCommonBots,
  filterEmotes,
  filterNonMods,
  filterNonSubs,
  filterNonVips,
} from 'main/filters';
// import Store from 'electron-store';
// import os from 'os';

// import storage from 'electron-json-storage';

// storage.setDataPath(os.tmpdir());

const { Panel } = Collapse;

const panelStyle = {
  marginBottom: 24,
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [animatonOn, setIsAnimationOn] = useState(() => {
    if (window.electron.store.get('animatonOn')) {
      return window.electron.store.get('animatonOn');
    }
    return false;
  });

  const [username, setUsername] = useState(() => {
    if (window.electron.store.get('username')) {
      return window.electron.store.get('username');
    }
    return 'icon33';
  });

  const [messageLimit, setMessageLimit] = useState<string>('15');

  const [preserveTwitchColorChange, setPreserveTwitchColorChange] = useState(
    () => {
      if (window.electron.store.get('preserveTwitchColorChange')) {
        return window.electron.store.get('preserveTwitchColorChange');
      }
      return false;
    }
  );

  const [filterCommonBotsEnabled, setFilterCommonBotsEnabled] = useState(() => {
    if (window.electron.store.get('filterCommonBotsEnabled')) {
      return window.electron.store.get('filterCommonBotsEnabled');
    }
    return false;
  });

  const [filterNonVipsEnabled, setFilterNonVipsEnabled] = useState(() => {
    if (window.electron.store.get('filterNonVipsEnabled')) {
      return window.electron.store.get('filterNonVipsEnabled');
    }
    return false;
  });

  const [filterNonModsEnabled, setFilterNonModsEnabled] = useState(() => {
    if (window.electron.store.get('filterNonModsEnabled')) {
      return window.electron.store.get('filterNonModsEnabled');
    }
    return false;
  });

  const [filterNonSubsEnabled, setFilterNonSubsEnabled] = useState(() => {
    if (window.electron.store.get('filterNonSubsEnabled')) {
      return window.electron.store.get('filterNonSubsEnabled');
    }
    return false;
  });

  const [filterEmotesEnabled, setFilterEmotesEnabled] = useState(() => {
    if (window.electron.store.get('filterEmotesEnabled')) {
      return window.electron.store.get('filterEmotesEnabled');
    }
    return false;
  });

  const [bgColor, setBgColor] = useState(() => {
    if (window.electron.store.get('bgColor')) {
      return window.electron.store.get('bgColor');
    }
    return 'linear-gradient(270deg, rgba(0, 198, 251, 0.51) 0.00%,rgba(0, 91, 234, 0.54) 100.00%)';
  });

  const [usernameColor, setUsernameColor] = useState(() => {
    if (window.electron.store.get('usernameColor')) {
      return window.electron.store.get('usernameColor');
    }
    return { a: 1, b: 219, g: 255, r: 0 };
  });

  const [usernameFontSize, setUsernameFontSize] = useState(() => {
    if (window.electron.store.get('usernameFontSize')) {
      return window.electron.store.get('usernameFontSize');
    }
    return 32;
  });

  const onUsernameSizeChange = (newValue: number) => {
    setUsernameFontSize(newValue);
    window.electron.store.set('usernameFontSize', newValue);
  };

  const [chatColor, setChatColor] = useState(() => {
    if (window.electron.store.get('chatColor')) {
      return window.electron.store.get('chatColor');
    }
    return { a: 1, b: 255, g: 255, r: 255 };
  });

  const [moderatorChatBgColor, setModeratorChatBgColor] = useState(() => {
    if (window.electron.store.get('moderatorChatBgColor')) {
      return window.electron.store.get('moderatorChatBgColor');
    }
    return { a: 0.4, b: 3, g: 219, r: 0 };
  });

  const [vipChatBgColor, setVipChattColor] = useState(() => {
    if (window.electron.store.get('vipChatBgColor')) {
      return window.electron.store.get('vipChatBgColor');
    }
    return { a: 0.4, b: 211, g: 0, r: 255 };
  });

  const [firstChatBgColor, setfirstChatBgColor] = useState(() => {
    if (window.electron.store.get('firstChatBgColor')) {
      return window.electron.store.get('firstChatBgColor');
    }
    return { a: 0.4, b: 157, g: 235, r: 0 };
  });

  const [subChatBgColor, setSubChatBgColor] = useState(() => {
    if (window.electron.store.get('subChatBgColor')) {
      return window.electron.store.get('subChatBgColor');
    }
    return { a: 0.4, b: 255, g: 0, r: 102 };
  });

  const [subChatColor, setSubChatColor] = useState(() => {
    if (window.electron.store.get('subChatColor')) {
      return window.electron.store.get('subChatColor');
    }
    return { a: 1, b: 255, g: 0, r: 255 };
  });

  const [chatFontSize, setChatFontSize] = useState(() => {
    if (window.electron.store.get('chatFontSize')) {
      return window.electron.store.get('chatFontSize');
    }
    return 32;
  });

  const onChatSizeChange = (newValue: number) => {
    setChatFontSize(newValue);
    window.electron.store.set('chatFontSize', newValue);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onPreserveTwitchColorChange = (e: CheckboxChangeEvent) => {
    setPreserveTwitchColorChange(e.target.checked);
    window.electron.store.set('preserveTwitchColorChange', e.target.checked);
  };

  const onFilterCommonBotsEnabled = (e: CheckboxChangeEvent) => {
    setFilterCommonBotsEnabled(e.target.checked);
    window.electron.store.set('filterCommonBotsEnabled', e.target.checked);
  };

  const onFilterNonSubsEnabled = (e: CheckboxChangeEvent) => {
    setFilterNonSubsEnabled(e.target.checked);
    window.electron.store.set('filterNonSubsEnabled', e.target.checked);
  };

  const onFilterNonVipsEnabled = (e: CheckboxChangeEvent) => {
    setFilterNonVipsEnabled(e.target.checked);
    window.electron.store.set('filterNonVipsEnabled', e.target.checked);
  };

  const onFilterNonModsEnabled = (e: CheckboxChangeEvent) => {
    setFilterNonModsEnabled(e.target.checked);
    window.electron.store.set('filterNonModsEnabled', e.target.checked);
  };

  const onFilterEmotesEnabled = (e: CheckboxChangeEvent) => {
    setFilterEmotesEnabled(e.target.checked);
    window.electron.store.set('filterEmotesEnabled', e.target.checked);
  };

  const chatterTypeStyle = (chatter: any): any => {
    if (chatter?.badges?.moderator)
      return {
        backgroundColor: `rgba(${moderatorChatBgColor.r},${moderatorChatBgColor.g},${moderatorChatBgColor.b},${moderatorChatBgColor.a})`,
        borderTop: `1px solid rgba(${moderatorChatBgColor.r},${moderatorChatBgColor.g},${moderatorChatBgColor.b},${moderatorChatBgColor.a})`,
        borderBottom: `1px solid rgba(${moderatorChatBgColor.r},${moderatorChatBgColor.g},${moderatorChatBgColor.b},${moderatorChatBgColor.a})`,
        marginTop: '-1px',
        borderRadius: '20px',
      };
    if (chatter?.badges?.vip)
      return {
        backgroundColor: `rgba(${vipChatBgColor.r},${vipChatBgColor.g},${vipChatBgColor.b},${vipChatBgColor.a})`,
        borderTop: `1px solid rgba(${vipChatBgColor.r},${vipChatBgColor.g},${vipChatBgColor.b},${vipChatBgColor.a})`,
        borderBottom: `1px solid rgba(${vipChatBgColor.r},${vipChatBgColor.g},${vipChatBgColor.b},${vipChatBgColor.a})`,
        marginTop: '-1px',
        borderRadius: '20px',
      };
    if (chatter?.firstMessage)
      return {
        backgroundColor: `rgba(${firstChatBgColor.r},${firstChatBgColor.g},${firstChatBgColor.b},${firstChatBgColor.a})`,
        borderTop: `1px solid rgba(${firstChatBgColor.r},${firstChatBgColor.g},${firstChatBgColor.b},${firstChatBgColor.a})`,
        borderBottom: `1px solid rgba(${firstChatBgColor.r},${firstChatBgColor.g},${firstChatBgColor.b},${firstChatBgColor.a})`,
        marginTop: '-1px',
        borderRadius: '20px',
      };
    if (chatter?.badges?.subscriber)
      return {
        backgroundColor: `rgba(${subChatBgColor.r},${subChatBgColor.g},${subChatBgColor.b},${subChatBgColor.a})`,
        borderTop: `1px solid rgba(${subChatBgColor.r},${subChatBgColor.g},${subChatBgColor.b},${subChatBgColor.a})`,
        borderBottom: `1px solid rgba(${subChatBgColor.r},${subChatBgColor.g},${subChatBgColor.b},${subChatBgColor.a})`,
        marginTop: '-1px',
        borderRadius: '20px',
      };
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'auto',
    });
  };

  const client = new tmi.Client({ channels: [username || ''] });

  client.on('message', (_, tags, message) => {
    const author: string = tags['display-name'] || '';

    const options: EmoteOptions = {
      format: 'default',
      themeMode: 'light',
      scale: '2.0',
    };

    const msg: Message = {
      id: tags?.id,
      username: tags['display-name'],
      twitch: tags?.username,
      emotes: tags?.emotes || {},
      date: new Date(),
      message,
      badges: tags?.badges,
      mod: tags?.mod,
      subscriber: tags?.subscriber,
      color: tags?.color,
      userType: tags?.['user-type'],
      turbo: tags?.turbo,
      returningChatter: tags?.['returning-chatter'],
      firstMessage: tags?.['first-msg'],
    };

    msg.message = parse(msg.message, msg.emotes, options);
    if (
      msg.message.includes(
        "&lt<img src ='https://static-cdn.jtvnw.net/emoticons/v2/555555584/default/light/2.0' class='twitch-emote'/>"
      )
    )
      msg.message = msg.message.replaceAll(
        "&lt<img src ='https://static-cdn.jtvnw.net/emoticons/v2/555555584/default/light/2.0' class='twitch-emote'/>",
        "<img src ='https://static-cdn.jtvnw.net/emoticons/v2/555555584/default/light/2.0' class='twitch-emote'/>"
      );

    console.log(JSON.stringify(msg, null, 6));

    setMessages((oldMessages) => {
      if (oldMessages.length >= Number(messageLimit)) oldMessages.shift();
      return [...oldMessages, msg];
    });
  });

  client.on('connected', () => {
    console.log(`Je suis bien connecté ${username}`);
  });

  client.on(
    'messagedeleted',
    (_channel, _username, _deleteMessage, userstate) => {
      setMessages((msgs: Message[]) => {
        const msgId = userstate['target-msg-id'];
        const allMsgs = [...msgs];
        const cleanMsgs = allMsgs.filter((m) => m.id !== msgId);

        return cleanMsgs;
      });
    }
  );

  client.on('ban', (_channel, username) => {
    setMessages((msgs) => {
      const allMsgs = [...msgs];
      const cleanMsgs = allMsgs.filter((m) => m.twitch !== username);

      return cleanMsgs;
    });
  });

  client.on('timeout', (_channel, username) => {
    setMessages((msgs) => {
      const allMsgs = [...msgs];
      const cleanMsgs = allMsgs.filter((m) => m.twitch !== username);

      return cleanMsgs;
    });
  });

  client.on('clearchat', () => setMessages([]));

  useEffect(() => {
    client.connect();
  }, []);
  return (
    <div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        mask={false}
        closable={false}
        style={{
          minWidth: '342px',
        }}
      >
        <div>
          <div className="settings">
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) => (
                <IoIosArrowDropdown
                  size={50}
                  style={{
                    transform: isActive ? 'rotate(0deg)' : 'rotate(270deg)',
                  }}
                />
              )}
            >
              <Panel
                header={<h1>Twitch Settings</h1>}
                key={1}
                style={panelStyle}
              >
                <h3>Twitch Username</h3>
                <Input
                  className="usernameInput"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUsername(e.target.value);
                    window.electron.store.set('username', e.target.value);
                  }}
                />
              </Panel>
              <Panel header={<h1>Background</h1>} key={2} style={panelStyle}>
                <h3>Background Color</h3>
                <div className="colorPicker">
                  <ReactGPicker
                    value="red"
                    gradient
                    onChange={(color) => {
                      setBgColor(color);
                      window.electron.store.set('bgColor', color);
                    }}
                  />
                </div>
              </Panel>
              <Panel header={<h1>Usernames</h1>} key={3} style={panelStyle}>
                <h2>ALL</h2>
                <h3>Username Color</h3>
                <SketchPicker
                  color={usernameColor}
                  onChange={(color) => {
                    setUsernameColor(color.rgb);
                    window.electron.store.set('usernameColor', color.rgb);
                  }}
                  className="colorPicker"
                />
                <br />
                <Checkbox
                  checked={preserveTwitchColorChange}
                  onChange={onPreserveTwitchColorChange}
                >
                  <h3>Preserve Twitch Colors</h3>
                </Checkbox>
                <h3>Username Size</h3>
                <Slider
                  min={16}
                  max={48}
                  onChange={onUsernameSizeChange}
                  value={
                    typeof usernameFontSize === 'number' ? usernameFontSize : 0
                  }
                />
                <hr className="solid" />
              </Panel>
              <Panel header={<h1>Messages</h1>} key={4} style={panelStyle}>
                <Checkbox
                  checked={animatonOn}
                  onChange={(e) => {
                    setIsAnimationOn(e.target.checked);
                    window.electron.store.set('animatonOn', e.target.checked);
                  }}
                >
                  <h3>Message Animation</h3>
                </Checkbox>
                <h3>Chat Message Color</h3>
                <SketchPicker
                  color={chatColor}
                  onChange={(color) => {
                    setChatColor(color.rgb);
                    window.electron.store.set('chatColor', color.rgb);
                  }}
                  className="colorPicker"
                />
                <br />
                <h3>Chat Message Size</h3>
                <Slider
                  min={16}
                  max={48}
                  onChange={onChatSizeChange}
                  value={typeof chatFontSize === 'number' ? chatFontSize : 0}
                />
                <Collapse bordered={false}>
                  <Panel header="Message Background" key={1} style={panelStyle}>
                    <h3>Moderator Chat Message Background Color</h3>
                    <SketchPicker
                      color={moderatorChatBgColor}
                      onChange={(color) => {
                        setModeratorChatBgColor(color.rgb);
                        window.electron.store.set(
                          'moderatorChatBgColor',
                          color.rgb
                        );
                      }}
                      className="colorPicker"
                    />
                    <h3>VIP Chat Message Background Color</h3>
                    <SketchPicker
                      color={vipChatBgColor}
                      onChange={(color) => {
                        setVipChattColor(color.rgb);
                        window.electron.store.set('vipChatBgColor', color.rgb);
                      }}
                      className="colorPicker"
                    />
                    <h3>First Chat Message Background Color</h3>
                    <SketchPicker
                      color={firstChatBgColor}
                      onChange={(color) => {
                        setfirstChatBgColor(color.rgb);
                        window.electron.store.set(
                          'firstChatBgColor',
                          color.rgb
                        );
                      }}
                      className="colorPicker"
                    />
                    <h3>Subscriber Chat Message Background Color</h3>
                    <SketchPicker
                      color={subChatBgColor}
                      onChange={(color) => {
                        setSubChatBgColor(color.rgb);
                        window.electron.store.set('subChatBgColor', color.rgb);
                      }}
                      className="colorPicker"
                    />
                  </Panel>
                </Collapse>
              </Panel>
              <Panel header={<h1>Chat Filters</h1>} key={5} style={panelStyle}>
                <Collapse bordered={false}>
                  <Panel header="Author Filters" key={1} style={panelStyle}>
                    <Checkbox
                      checked={filterCommonBotsEnabled}
                      onChange={onFilterCommonBotsEnabled}
                    >
                      <h3>Filter Common Bots</h3>
                    </Checkbox>
                    <Checkbox
                      checked={filterNonSubsEnabled}
                      onChange={onFilterNonSubsEnabled}
                    >
                      <h3>Filter Non Subscribers</h3>
                    </Checkbox>
                    <Checkbox
                      checked={filterNonVipsEnabled}
                      onChange={onFilterNonVipsEnabled}
                    >
                      <h3>Filter Non VIPs</h3>
                    </Checkbox>
                    <Checkbox
                      checked={filterNonModsEnabled}
                      onChange={onFilterNonModsEnabled}
                    >
                      <h3>Filter Non Moderators</h3>
                    </Checkbox>
                  </Panel>
                </Collapse>
                <Collapse bordered={false}>
                  <Panel header="Message Filters" key={1} style={panelStyle}>
                    <Checkbox
                      checked={filterEmotesEnabled}
                      onChange={onFilterEmotesEnabled}
                    >
                      <h3>NO EMOTES</h3>
                    </Checkbox>
                    <Checkbox
                      checked={filterNonSubsEnabled}
                      onChange={onFilterNonSubsEnabled}
                    >
                      <h3>Filter !commands</h3>
                    </Checkbox>
                  </Panel>
                </Collapse>
              </Panel>
            </Collapse>
          </div>
        </div>
      </Modal>
      <div className="body">
        <div
          className="chat"
          style={{
            background: bgColor,
            minHeight: '100%',
          }}
        >
          <div id="scroller">
            {messages.map((msg) => {
              if (
                msg.username &&
                !filterCommonBots(msg.username, filterCommonBotsEnabled) &&
                msg.message &&
                !filterNonSubs(msg, filterNonSubsEnabled) &&
                !filterNonVips(msg, filterNonVipsEnabled) &&
                !filterNonMods(msg, filterNonModsEnabled)
              ) {
                msg.message = filterEmotes(msg, filterEmotesEnabled);
                return (
                  <>
                    <section
                      className="message"
                      style={{
                        ...chatterTypeStyle(msg),
                        animation: animatonOn ? 'fadeIn 0.4s' : '',
                        display:
                          msg.username.length +
                            msg.message.replaceAll(/(<([^>]+)>)/gi, '-')
                              .length >
                          28
                            ? 'block'
                            : 'flex',
                      }}
                    >
                      <h3
                        style={{
                          color: `${
                            preserveTwitchColorChange
                              ? msg.color
                              : `rgba(${usernameColor.r},${usernameColor.g},${usernameColor.b},${usernameColor.a})`
                          }`,
                          fontSize: usernameFontSize,
                          overflowWrap: 'break-word',
                          fontWeight: 'bold',
                        }}
                      >
                        {msg.username}
                      </h3>{' '}
                      <p
                        style={{
                          color: `rgba(${chatColor.r},${chatColor.g},${chatColor.b},${chatColor.a})`,
                          fontSize: chatFontSize,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: Autolinker.link(msg.message),
                        }}
                      />
                    </section>
                    {/* <br /> */}
                  </>
                );
              }
            })}
            {/* <div id="anchor" /> */}
          </div>
          <div className="controls">
            <MdSettingsApplications
              size={30}
              title="Settings"
              onClick={showModal}
            />
            <IoMdArrowDropdownCircle size={30} onClick={scrollToBottom} />
            <MdPowerSettingsNew
              size={30}
              style={{
                float: 'right',
              }}
              onClick={() => window.close()}
            />
            <IoMdInformationCircleOutline
              style={{
                float: 'right',
              }}
              size={30}
              onClick={() => window.close()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
      </Routes>
    </Router>
  );
}
