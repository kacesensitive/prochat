/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Collapse,
  Input,
  message,
  Modal,
  Slider,
  Space,
} from 'antd';
import tmi from 'tmi.js';
import './App.css';
import { Message } from 'types/Messages';
import { EmoteOptions, parse } from 'simple-tmi-emotes';
import { SketchPicker } from 'react-color';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import ReactGPicker from 'react-gcolor-picker';
import { IoIosArrowDropdown } from 'react-icons/io';
import { MdSettingsApplications, MdPowerSettingsNew } from 'react-icons/md';
import { FaKey } from 'react-icons/fa';
import { AiFillCaretDown, AiOutlineQuestionCircle } from 'react-icons/ai';
import Autolinker from 'autolinker';
import {
  filterCommands,
  filterCommonBots,
  filterEmotes,
  filterNonMods,
  filterNonSubs,
  filterNonVips,
} from 'main/filters';
import logo from '../../assets/logo.png';

const fetch = require('node-fetch');

const { Panel } = Collapse;

const panelStyle = {
  marginBottom: 24,
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isValidated, setIsValidated] = useState(() => {
    if (window.electron.store.get('isValidated')) {
      return window.electron.store.get('isValidated');
    }
    return false;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
    return '';
  });

  const [licenseKey, setLicenseKey] = useState(() => {
    if (window.electron.store.get('licenseKey')) {
      return window.electron.store.get('licenseKey');
    }
    return '';
  });

  const [activationToken, setActivationToken] = useState(() => {
    if (window.electron.store.get('activationToken')) {
      return window.electron.store.get('activationToken');
    }
    return '';
  });

  const [messageLimit, setMessageLimit] = useState<string>('100');

  const [preserveTwitchColorChange, setPreserveTwitchColorChange] = useState(
    () => {
      if (window.electron.store.get('preserveTwitchColorChange')) {
        return window.electron.store.get('preserveTwitchColorChange');
      }
      return false;
    }
  );

  const [subOverride, setSubOverride] = useState(() => {
    if (window.electron.store.get('subOverride')) {
      return window.electron.store.get('subOverride');
    }
    return false;
  });

  const [
    subscriberPreserveTwitchColorChange,
    setSubscriberPreserveTwitchColorChange,
  ] = useState(() => {
    if (window.electron.store.get('subscriberPreserveTwitchColorChange')) {
      return window.electron.store.get('subscriberPreserveTwitchColorChange');
    }
    return false;
  });

  const [ftcOverride, setFtcOverride] = useState(() => {
    if (window.electron.store.get('ftcOverride')) {
      return window.electron.store.get('ftcOverride');
    }
    return false;
  });

  const [ftcPreserveTwitchColorChange, setFtcPreserveTwitchColorChange] =
    useState(() => {
      if (window.electron.store.get('ftcPreserveTwitchColorChange')) {
        return window.electron.store.get('ftcPreserveTwitchColorChange');
      }
      return false;
    });

  const [vipOverride, setVipOverride] = useState(() => {
    if (window.electron.store.get('vipOverride')) {
      return window.electron.store.get('vipOverride');
    }
    return false;
  });

  const [vipPreserveTwitchColorChange, setVipPreserveTwitchColorChange] =
    useState(() => {
      if (window.electron.store.get('vipPreserveTwitchColorChange')) {
        return window.electron.store.get('vipPreserveTwitchColorChange');
      }
      return false;
    });

  const [modOverride, setModOverride] = useState(() => {
    if (window.electron.store.get('modOverride')) {
      return window.electron.store.get('modOverride');
    }
    return false;
  });

  const [modPreserveTwitchColorChange, setModPreserveTwitchColorChange] =
    useState(() => {
      if (window.electron.store.get('modPreserveTwitchColorChange')) {
        return window.electron.store.get('modPreserveTwitchColorChange');
      }
      return false;
    });

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

  const [filterCommandsEnabled, setFilterCommandsEnabled] = useState(() => {
    if (window.electron.store.get('filterCommandsEnabled')) {
      return window.electron.store.get('filterCommandsEnabled');
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
    return 'linear-gradient(45deg, rgb(0, 0, 0) 0.00%,rgb(145, 145, 145) 100.00%)';
  });

  const [usernameColor, setUsernameColor] = useState(() => {
    if (window.electron.store.get('usernameColor')) {
      return window.electron.store.get('usernameColor');
    }
    return { a: 1, b: 219, g: 255, r: 0 };
  });

  const [usernameShadow, setUsernameShadow] = useState(() => {
    if (window.electron.store.get('usernameShadow')) {
      return window.electron.store.get('usernameShadow');
    }
    return true;
  });

  const [subscriberUsernameShadow, setSubscriberUsernameShadow] = useState(
    () => {
      if (window.electron.store.get('subscriberUsernameShadow')) {
        return window.electron.store.get('subscriberUsernameShadow');
      }
      return true;
    }
  );

  const [vipUsernameShadow, setVipUsernameShadow] = useState(() => {
    if (window.electron.store.get('vipUsernameShadow')) {
      return window.electron.store.get('vipUsernameShadow');
    }
    return true;
  });

  const [modUsernameShadow, setModUsernameShadow] = useState(() => {
    if (window.electron.store.get('modUsernameShadow')) {
      return window.electron.store.get('modUsernameShadow');
    }
    return true;
  });

  const [ftcUsernameShadow, setFtcUsernameShadow] = useState(() => {
    if (window.electron.store.get('ftcUsernameShadow')) {
      return window.electron.store.get('ftcUsernameShadow');
    }
    return true;
  });

  const [messageShadow, setMessageShadow] = useState(() => {
    if (window.electron.store.get('messageShadow')) {
      return window.electron.store.get('messageShadow');
    }
    return false;
  });

  const [usernameFontSize, setUsernameFontSize] = useState(() => {
    if (window.electron.store.get('usernameFontSize')) {
      return window.electron.store.get('usernameFontSize');
    }
    return 32;
  });

  const [subscriberUsernameFontSize, setSubscriberUsernameFontSize] = useState(
    () => {
      if (window.electron.store.get('subscriberUsernameFontSize')) {
        return window.electron.store.get('subscriberUsernameFontSize');
      }
      return 32;
    }
  );

  const [emoteSize, setEmoteSize] = useState(() => {
    if (window.electron.store.get('emoteSize')) {
      return window.electron.store.get('emoteSize');
    }
    return 1;
  });

  const [vipUsernameFontSize, setVipUsernameFontSize] = useState(() => {
    if (window.electron.store.get('vipUsernameFontSize')) {
      return window.electron.store.get('vipUsernameFontSize');
    }
    return 32;
  });

  const [modUsernameFontSize, setModUsernameFontSize] = useState(() => {
    if (window.electron.store.get('modUsernameFontSize')) {
      return window.electron.store.get('modUsernameFontSize');
    }
    return 32;
  });

  const [ftcUsernameFontSize, setFtcUsernameFontSize] = useState(() => {
    if (window.electron.store.get('ftcUsernameFontSize')) {
      return window.electron.store.get('ftcUsernameFontSize');
    }
    return 32;
  });

  const onUsernameSizeChange = (newValue: number) => {
    setUsernameFontSize(newValue);
    window.electron.store.set('usernameFontSize', newValue);
  };

  const onSetValidated = (newValue: boolean) => {
    setIsValidated(newValue);
    window.electron.store.set('isValidated', newValue);
  };

  const onSubscriberUsernameSizeChange = (newValue: number) => {
    setSubscriberUsernameFontSize(newValue);
    window.electron.store.set('subscriberUsernameFontSize', newValue);
  };

  const onEmoteSizeChange = (newValue: number) => {
    setEmoteSize(newValue);
    window.electron.store.set('emoteSize', newValue);
    window.location.reload();
  };

  const onVipUsernameSizeChange = (newValue: number) => {
    setVipUsernameFontSize(newValue);
    window.electron.store.set('vipUsernameFontSize', newValue);
  };

  const onModUsernameSizeChange = (newValue: number) => {
    setModUsernameFontSize(newValue);
    window.electron.store.set('modUsernameFontSize', newValue);
  };

  const onFtcUsernameSizeChange = (newValue: number) => {
    setFtcUsernameFontSize(newValue);
    window.electron.store.set('ftcUsernameFontSize', newValue);
  };

  const [validating, setValidating] = useState<boolean>();

  const [chatColor, setChatColor] = useState(() => {
    if (window.electron.store.get('chatColor')) {
      return window.electron.store.get('chatColor');
    }
    return { a: 1, b: 255, g: 255, r: 255 };
  });

  const [linksColor, setLinksColor] = useState(() => {
    if (window.electron.store.get('chatColor')) {
      return window.electron.store.get('chatColor');
    }
    return { a: 1, b: 1, g: 1, r: 255 };
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

  const [subUsernameColor, setSubUsernameColor] = useState(() => {
    if (window.electron.store.get('subUsernameColor')) {
      return window.electron.store.get('subUsernameColor');
    }
    return { a: 0.4, b: 255, g: 0, r: 102 };
  });

  const [vipUsernameColor, setVipUsernameColor] = useState(() => {
    if (window.electron.store.get('vipUsernameColor')) {
      return window.electron.store.get('vipUsernameColor');
    }
    return { a: 0.4, b: 255, g: 0, r: 102 };
  });

  const [modUsernameColor, setModUsernameColor] = useState(() => {
    if (window.electron.store.get('modUsernameColor')) {
      return window.electron.store.get('modUsernameColor');
    }
    return { a: 0.4, b: 255, g: 0, r: 102 };
  });

  const [ftcUsernameColor, setFtcUsernameColor] = useState(() => {
    if (window.electron.store.get('ftcUsernameColor')) {
      return window.electron.store.get('ftcUsernameColor');
    }
    return { a: 0.4, b: 255, g: 0, r: 102 };
  });

  const [chatFontSize, setChatFontSize] = useState(() => {
    if (window.electron.store.get('chatFontSize')) {
      return window.electron.store.get('chatFontSize');
    }
    return 32;
  });

  const [chatBlockSize, setChatBlockSize] = useState(() => {
    if (window.electron.store.get('chatBlockSize')) {
      return window.electron.store.get('chatBlockSize');
    }
    return 0;
  });

  const [messageApi, contextHolder] = message.useMessage();

  const getLicenseID = async () => {
    const response = await fetch(
      'https://api.keygen.sh/v1/accounts/kacey-dev/me',
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${activationToken}`,
        },
      }
    );

    const { data, errors } = await response.json();

    if (Array.isArray(errors) && errors.length > 0) {
      if (Array.isArray(errors)) {
        errors.forEach((error: any) => {
          if (error && error.code) {
            messageApi.error({
              type: 'error',
              content: `${error.code}\n${error.detail}`,
            });
          } else {
            console.log(error);
          }
        });
      } else {
        console.log(errors);
      }
    }

    if (data.attributes.key !== licenseKey) {
      messageApi.error({
        type: 'error',
        content:
          'Keys do not match! Please verify Activation Key and License Key',
      });
      throw new Error(
        'Keys do not match! Please verify Activation Key and License Key'
      );
    }

    return { data };
  };

  const assignMachine = async (lid: any, fingerprint: any) => {
    let licenseId;
    if (lid.data && lid.data.id) {
      licenseId = lid.data.id;
    }
    const response = await fetch(
      'https://api.keygen.sh/v1/accounts/kacey-dev/machines',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${activationToken}`,
        },
        body: JSON.stringify({
          data: {
            type: 'machines',
            attributes: {
              fingerprint,
            },
            relationships: {
              license: {
                data: {
                  type: 'licenses',
                  id: licenseId,
                },
              },
            },
          },
        }),
      }
    );

    const { data, errors } = await response.json();

    if (errors && errors.length > 0) {
      throw errors;
    }

    return data;
  };

  async function validateLicenseKey() {
    window.electron.store.bet();
    const id = window.electron.store.get('machineID');
    const licenseID = await getLicenseID();

    const data = await assignMachine(licenseID, id);

    return data;
  }

  const enterValidating = () => {
    setValidating(true);
    validateLicenseKey()
      .then((res) => {
        if (res) {
          setValidating(false);
          messageApi.success({
            type: 'success',
            content: 'Succcess: ENJOY!!',
          });
          onSetValidated(true);
          return '';
        }
        return '';
      })
      .catch((e) => {
        setValidating(false);
        if (Array.isArray(e)) {
          e.forEach((error: any) => {
            if (error && error.code) {
              messageApi.error({
                type: 'error',
                content: `${error.code}\n${error.detail}`,
              });
            } else {
              console.log(error);
            }
          });
        } else {
          console.log(e);
        }
      });
  };

  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `.cssClass { color: ${linksColor}; }`;

  const onChatSizeChange = (newValue: number) => {
    setChatFontSize(newValue);
    window.electron.store.set('chatFontSize', newValue);
  };

  const onChatBlockSizeChange = (newValue: number) => {
    setChatBlockSize(newValue);
    window.electron.store.set('chatBlockSize', newValue);
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

  const showValidateModal = () => {
    setIsValidateModalOpen(true);
  };

  const handleVOk = () => {
    setIsValidateModalOpen(false);
  };

  const handleVCancel = () => {
    setIsValidateModalOpen(false);
  };

  const showInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  const handleInfoOk = () => {
    setIsInfoModalOpen(false);
  };

  const handleInfoCancel = () => {
    setIsInfoModalOpen(false);
  };

  const onUsernameShadow = (e: CheckboxChangeEvent) => {
    setUsernameShadow(e.target.checked);
    window.electron.store.set('usernameShadow', e.target.checked);
  };

  const onSubscriberUsernameShadow = (e: CheckboxChangeEvent) => {
    setSubscriberUsernameShadow(e.target.checked);
    window.electron.store.set('subscriberUsernameShadow', e.target.checked);
  };

  const onVipUsernameShadow = (e: CheckboxChangeEvent) => {
    setVipUsernameShadow(e.target.checked);
    window.electron.store.set('vipUsernameShadow', e.target.checked);
  };

  const onModUsernameShadow = (e: CheckboxChangeEvent) => {
    setModUsernameShadow(e.target.checked);
    window.electron.store.set('modUsernameShadow', e.target.checked);
  };

  const onFtcUsernameShadow = (e: CheckboxChangeEvent) => {
    setFtcUsernameShadow(e.target.checked);
    window.electron.store.set('ftcUsernameShadow', e.target.checked);
  };

  const onMessageShadow = (e: CheckboxChangeEvent) => {
    setMessageShadow(e.target.checked);
    window.electron.store.set('messageShadow', e.target.checked);
  };

  const onPreserveTwitchColorChange = (e: CheckboxChangeEvent) => {
    setPreserveTwitchColorChange(e.target.checked);
    window.electron.store.set('preserveTwitchColorChange', e.target.checked);
  };

  const onSubOverride = (e: CheckboxChangeEvent) => {
    setSubOverride(e.target.checked);
    window.electron.store.set('subOverride', e.target.checked);
  };

  const onVipOverride = (e: CheckboxChangeEvent) => {
    setVipOverride(e.target.checked);
    window.electron.store.set('vipOverride', e.target.checked);
  };

  const onModOverride = (e: CheckboxChangeEvent) => {
    setModOverride(e.target.checked);
    window.electron.store.set('modOverride', e.target.checked);
  };

  const onFtcOverride = (e: CheckboxChangeEvent) => {
    setFtcOverride(e.target.checked);
    window.electron.store.set('ftcOverride', e.target.checked);
  };

  const onSubscriberPreserveTwitchColorChange = (e: CheckboxChangeEvent) => {
    setSubscriberPreserveTwitchColorChange(e.target.checked);
    window.electron.store.set(
      'subscriberPreserveTwitchColorChange',
      e.target.checked
    );
  };

  const onVipPreserveTwitchColorChange = (e: CheckboxChangeEvent) => {
    setVipPreserveTwitchColorChange(e.target.checked);
    window.electron.store.set('vipPreserveTwitchColorChange', e.target.checked);
  };

  const onModPreserveTwitchColorChange = (e: CheckboxChangeEvent) => {
    setModPreserveTwitchColorChange(e.target.checked);
    window.electron.store.set('modPreserveTwitchColorChange', e.target.checked);
  };

  const onFtcPreserveTwitchColorChange = (e: CheckboxChangeEvent) => {
    setFtcPreserveTwitchColorChange(e.target.checked);
    window.electron.store.set('ftcPreserveTwitchColorChange', e.target.checked);
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

  const onFilterCommandsEnabled = (e: CheckboxChangeEvent) => {
    setFilterCommandsEnabled(e.target.checked);
    window.electron.store.set('filterCommandsEnabled', e.target.checked);
  };

  const onFilterEmotesEnabled = (e: CheckboxChangeEvent) => {
    setFilterEmotesEnabled(e.target.checked);
    window.electron.store.set('filterEmotesEnabled', e.target.checked);
  };

  // eslint-disable-next-line consistent-return
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
    if (chatter?.subscriber)
      return {
        backgroundColor: `rgba(${subChatBgColor.r},${subChatBgColor.g},${subChatBgColor.b},${subChatBgColor.a})`,
        borderTop: `1px solid rgba(${subChatBgColor.r},${subChatBgColor.g},${subChatBgColor.b},${subChatBgColor.a})`,
        borderBottom: `1px solid rgba(${subChatBgColor.r},${subChatBgColor.g},${subChatBgColor.b},${subChatBgColor.a})`,
        marginTop: '-1px',
        borderRadius: '20px',
      };
  };

  const usernameColorByType = (chatter: any): any => {
    if (chatter?.firstMessage && ftcOverride) {
      if (ftcPreserveTwitchColorChange) {
        return chatter.color;
      }
      return `rgba(${ftcUsernameColor.r},${ftcUsernameColor.g},${ftcUsernameColor.b},${ftcUsernameColor.a})`;
    }
    if (chatter?.badges?.vip && vipOverride) {
      if (vipPreserveTwitchColorChange) {
        return chatter.color;
      }
      return `rgba(${vipUsernameColor.r},${vipUsernameColor.g},${vipUsernameColor.b},${vipUsernameColor.a})`;
    }
    if (chatter?.badges?.moderator && modOverride) {
      if (modPreserveTwitchColorChange) {
        return chatter.color;
      }
      return `rgba(${modUsernameColor.r},${modUsernameColor.g},${modUsernameColor.b},${modUsernameColor.a})`;
    }
    if (chatter?.subscriber && subOverride) {
      if (subscriberPreserveTwitchColorChange) {
        return chatter.color;
      }
      return `rgba(${subUsernameColor.r},${subUsernameColor.g},${subUsernameColor.b},${subUsernameColor.a})`;
    }
    if (preserveTwitchColorChange) {
      return chatter.color;
    }
    return `rgba(${usernameColor.r},${usernameColor.g},${usernameColor.b},${usernameColor.a})`;
  };

  const usernameShadowByType = (chatter: any): any => {
    if (chatter?.firstMessage && ftcOverride) {
      return ftcUsernameShadow ? '2px 2px black' : '';
    }
    if (chatter?.badges?.vip && vipOverride) {
      return vipUsernameShadow ? '2px 2px black' : '';
    }
    if (chatter?.badges?.moderator && modOverride) {
      return modUsernameShadow ? '2px 2px black' : '';
    }
    if (chatter?.subscriber && subOverride) {
      return subscriberUsernameShadow ? '2px 2px black' : '';
    }
    return usernameShadow ? '2px 2px black' : '';
  };

  const usernameFontSizeType = (chatter: any): any => {
    if (chatter?.firstMessage && ftcOverride) {
      return ftcUsernameFontSize;
    }
    if (chatter?.badges?.vip && vipOverride) {
      return vipUsernameFontSize;
    }
    if (chatter?.badges?.moderator && subOverride) {
      return modUsernameFontSize;
    }
    if (chatter?.subscriber && subOverride) {
      return subscriberUsernameFontSize;
    }
    return usernameFontSize;
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };
  setTimeout(function () {
    scrollToBottom();
  }, 200);

  const client = new tmi.Client({ channels: [username || ''] });

  // eslint-disable-next-line @typescript-eslint/no-shadow
  client.on('message', (_, tags, message) => {
    const options: EmoteOptions = {
      format: 'default',
      themeMode: 'light',
      // @ts-ignore
      scale: `${emoteSize}.0`,
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
        "&lt<img src ='https://static-cdn.jtvnw.net/emoticons/v2/555555584/default/light/"
      )
    )
      msg.message = msg.message.replaceAll(
        "&lt<img src ='https://static-cdn.jtvnw.net/emoticons/v2/555555584/default/light/",
        "<img src ='https://static-cdn.jtvnw.net/emoticons/v2/555555584/default/light/"
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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  client.on('ban', (_channel, username) => {
    setMessages((msgs) => {
      const allMsgs = [...msgs];
      const cleanMsgs = allMsgs.filter((m) => m.twitch !== username);

      return cleanMsgs;
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-shadow
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      {contextHolder}
      <Modal
        open={isInfoModalOpen}
        onOk={handleInfoOk}
        onCancel={handleInfoCancel}
        // mask={true}
        closable={false}
        style={{
          minWidth: '342px',
        }}
        className="noDrag"
      >
        <div>
          <div className="splashInfo">
            <img className="logoSplashInfo" alt="icon" src={logo} />
          </div>
        </div>
      </Modal>
      <Modal
        open={isValidateModalOpen}
        onOk={handleVOk}
        onCancel={handleVCancel}
        mask={false}
        closable={false}
        style={{
          minWidth: '342px',
        }}
        className="noDrag"
      >
        <div>
          <div className="settingsValidate">
            <h2>License Key 🔑</h2>
            <Input
              value={licenseKey}
              className="licenseInput"
              placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-V3"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLicenseKey(e.target.value);
                window.electron.store.set('licenseKey', e.target.value);
              }}
            />
            <h2>Activation Key 🔑</h2>
            <Input
              value={activationToken}
              className="licenseInput"
              placeholder="activ-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXv3"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setActivationToken(e.target.value);
                window.electron.store.set('activationToken', e.target.value);
              }}
            />
            <div style={{ minHeight: '10px' }} />
            <Space>
              {isValidated ? (
                <Button
                  type="primary"
                  icon={<FaKey />}
                  className="validateButton"
                  disabled
                >
                  &nbsp; Validated
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<FaKey />}
                  loading={validating}
                  onClick={() => enterValidating()}
                  className="validateButton"
                >
                  &nbsp; Validate!
                </Button>
              )}
              <Button
                type="primary"
                icon={<AiOutlineQuestionCircle size={20} />}
                onClick={() => {
                  setIsValidated(false);
                }}
              />
            </Space>
          </div>
        </div>
      </Modal>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        mask={false}
        closable={false}
        style={{
          minWidth: '342px',
        }}
        className="noDrag"
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
                  value={username}
                  className="usernameInput"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUsername(e.target.value);
                    window.electron.store.set('username', e.target.value);
                  }}
                />
                <Button onClick={() => window.location.reload()}>✅</Button>
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
                <Collapse bordered={false}>
                  <Panel header="All" key={1} style={panelStyle}>
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
                    <br />
                    <Checkbox
                      checked={usernameShadow}
                      onChange={onUsernameShadow}
                    >
                      <h3>Username Shadow</h3>
                    </Checkbox>
                    <h3>Username Size</h3>
                    <Slider
                      min={16}
                      max={48}
                      onChange={onUsernameSizeChange}
                      value={
                        typeof usernameFontSize === 'number'
                          ? usernameFontSize
                          : 0
                      }
                    />

                    <hr className="solid" />
                  </Panel>
                </Collapse>
                <Collapse bordered={false}>
                  <Panel header="Subscribers" key={1} style={panelStyle}>
                    <Checkbox checked={subOverride} onChange={onSubOverride}>
                      <h3>Subscriber Settings</h3>
                    </Checkbox>
                    <br />
                    <h3>Username Color</h3>
                    <SketchPicker
                      color={subUsernameColor}
                      onChange={(color) => {
                        setSubUsernameColor(color.rgb);
                        window.electron.store.set(
                          'subUsernameColor',
                          color.rgb
                        );
                      }}
                      className="colorPicker"
                    />
                    <br />
                    <Checkbox
                      checked={subscriberPreserveTwitchColorChange}
                      onChange={onSubscriberPreserveTwitchColorChange}
                    >
                      <h3>Preserve Twitch Colors</h3>
                    </Checkbox>
                    <br />
                    <Checkbox
                      checked={subscriberUsernameShadow}
                      onChange={onSubscriberUsernameShadow}
                    >
                      <h3>Username Shadow</h3>
                    </Checkbox>
                    <h3>Username Size</h3>
                    <Slider
                      min={16}
                      max={48}
                      onChange={onSubscriberUsernameSizeChange}
                      value={
                        typeof subscriberUsernameFontSize === 'number'
                          ? subscriberUsernameFontSize
                          : 0
                      }
                    />
                    <hr className="solid" />
                  </Panel>
                </Collapse>
                <Collapse bordered={false}>
                  <Panel header="VIPs" key={1} style={panelStyle}>
                    <Checkbox checked={vipOverride} onChange={onVipOverride}>
                      <h3>VIP Settings</h3>
                    </Checkbox>
                    <br />
                    <h3>Username Color</h3>
                    <SketchPicker
                      color={vipUsernameColor}
                      onChange={(color) => {
                        setVipUsernameColor(color.rgb);
                        window.electron.store.set(
                          'vipUsernameColor',
                          color.rgb
                        );
                      }}
                      className="colorPicker"
                    />
                    <br />
                    <Checkbox
                      checked={vipPreserveTwitchColorChange}
                      onChange={onVipPreserveTwitchColorChange}
                    >
                      <h3>Preserve Twitch Colors</h3>
                    </Checkbox>
                    <br />
                    <Checkbox
                      checked={vipUsernameShadow}
                      onChange={onVipUsernameShadow}
                    >
                      <h3>Username Shadow</h3>
                    </Checkbox>
                    <h3>Username Size</h3>
                    <Slider
                      min={16}
                      max={48}
                      onChange={onVipUsernameSizeChange}
                      value={
                        typeof vipUsernameFontSize === 'number'
                          ? vipUsernameFontSize
                          : 0
                      }
                    />
                    <hr className="solid" />
                  </Panel>
                </Collapse>
                <Collapse bordered={false}>
                  <Panel header="Mods" key={1} style={panelStyle}>
                    <Checkbox checked={modOverride} onChange={onModOverride}>
                      <h3>Mod Settings</h3>
                    </Checkbox>
                    <br />
                    <h3>Username Color</h3>
                    <SketchPicker
                      color={modUsernameColor}
                      onChange={(color) => {
                        setModUsernameColor(color.rgb);
                        window.electron.store.set(
                          'modUsernameColor',
                          color.rgb
                        );
                      }}
                      className="colorPicker"
                    />
                    <br />
                    <Checkbox
                      checked={modPreserveTwitchColorChange}
                      onChange={onModPreserveTwitchColorChange}
                    >
                      <h3>Preserve Twitch Colors</h3>
                    </Checkbox>
                    <br />
                    <Checkbox
                      checked={modUsernameShadow}
                      onChange={onModUsernameShadow}
                    >
                      <h3>Username Shadow</h3>
                    </Checkbox>
                    <h3>Username Size</h3>
                    <Slider
                      min={16}
                      max={48}
                      onChange={onModUsernameSizeChange}
                      value={
                        typeof modUsernameFontSize === 'number'
                          ? modUsernameFontSize
                          : 0
                      }
                    />
                    <hr className="solid" />
                  </Panel>
                </Collapse>
                <Collapse bordered={false}>
                  <Panel header="First Chat" key={1} style={panelStyle}>
                    <Checkbox checked={ftcOverride} onChange={onFtcOverride}>
                      <h3>First Chat Settings</h3>
                    </Checkbox>
                    <br />
                    <h3>Username Color</h3>
                    <SketchPicker
                      color={ftcUsernameColor}
                      onChange={(color) => {
                        setFtcUsernameColor(color.rgb);
                        window.electron.store.set(
                          'ftcUsernameColor',
                          color.rgb
                        );
                      }}
                      className="colorPicker"
                    />
                    <br />
                    <Checkbox
                      checked={ftcPreserveTwitchColorChange}
                      onChange={onFtcPreserveTwitchColorChange}
                    >
                      <h3>Preserve Twitch Colors</h3>
                    </Checkbox>
                    <br />
                    <Checkbox
                      checked={ftcUsernameShadow}
                      onChange={onFtcUsernameShadow}
                    >
                      <h3>Username Shadow</h3>
                    </Checkbox>
                    <h3>Username Size</h3>
                    <Slider
                      min={16}
                      max={48}
                      onChange={onFtcUsernameSizeChange}
                      value={
                        typeof ftcUsernameFontSize === 'number'
                          ? ftcUsernameFontSize
                          : 0
                      }
                    />
                    <hr className="solid" />
                  </Panel>
                </Collapse>
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
                <br />
                <Checkbox checked={messageShadow} onChange={onMessageShadow}>
                  <h3>Message Shadow</h3>
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
                <br />
                <h3>Chat Block Size</h3>
                <Slider
                  min={0}
                  max={30}
                  onChange={onChatBlockSizeChange}
                  value={typeof chatBlockSize === 'number' ? chatBlockSize : 0}
                />
                <br />
                <h3>Emote Size</h3>
                <Slider
                  min={1}
                  max={3}
                  marks={{
                    1: '12px',
                    2: '24px',
                    3: '48px',
                  }}
                  onChange={onEmoteSizeChange}
                  value={typeof emoteSize === 'number' ? emoteSize : 0}
                />
                <br />
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
                  <Panel header="Filters" key={1} style={panelStyle}>
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
                    <Checkbox
                      checked={filterCommandsEnabled}
                      onChange={onFilterCommandsEnabled}
                    >
                      <h3>Filter !commands</h3>
                    </Checkbox>
                  </Panel>
                </Collapse>
                {/* <Collapse bordered={false}>
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
                </Collapse> */}
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
          {!username ? (
            <>
              <div className="splash">
                <img className="logoSplash" width="700" alt="icon" src={logo} />
                <h1>Start by setting the username of the stream!</h1>
              </div>
              <div className="arrow">
                <AiFillCaretDown size={40} />
              </div>
            </>
          ) : (
            <div id="scroller">
              {messages.map((msg) => {
                if (
                  msg.username &&
                  !filterCommonBots(msg.username, filterCommonBotsEnabled) &&
                  msg.message &&
                  !filterNonSubs(msg, filterNonSubsEnabled) &&
                  !filterNonVips(msg, filterNonVipsEnabled) &&
                  !filterNonMods(msg, filterNonModsEnabled) &&
                  !filterCommands(msg, filterCommandsEnabled)
                ) {
                  msg.message = filterEmotes(msg, filterEmotesEnabled);
                  return (
                    <>
                      <section
                        className="message"
                        style={{
                          ...chatterTypeStyle(msg),
                          animation: animatonOn ? 'fadeIn 0.4s' : '',
                          display: 'block',
                        }}
                      >
                        <h3
                          style={{
                            color: usernameColorByType(msg),
                            fontSize: usernameFontSizeType(msg),
                            overflowWrap: 'break-word',
                            fontWeight: 'bold',
                            textShadow: usernameShadowByType(msg),
                            margin: `${chatBlockSize}px`,
                          }}
                        >
                          {msg.username}
                        </h3>
                        <p
                          style={{
                            color: `rgba(${chatColor.r},${chatColor.g},${chatColor.b},${chatColor.a})`,
                            fontSize: chatFontSize,
                            textShadow: messageShadow ? '2px 2px black' : '',
                            padding: '0px',
                            margin: `${chatBlockSize}px`,
                          }}
                          dangerouslySetInnerHTML={{
                            __html: Autolinker.link(msg.message, {
                              className: 'apple',
                            }),
                          }}
                        />
                      </section>
                      <br />
                    </>
                  );
                }
              })}
              {/* <div id="anchor" /> */}
            </div>
          )}
          <div className="controls">
            <MdSettingsApplications
              size={30}
              title="Settings"
              onClick={showModal}
            />
            <MdPowerSettingsNew
              size={30}
              style={{
                float: 'right',
              }}
              onClick={() => window.close()}
            />
            {/* <IoMdInformationCircleOutline
              style={{
                float: 'right',
              }}
              size={30}
              onClick={() => {

                console.log(availableFonts);
              }}
            /> */}
            {/* {!isValidated ? (
              <CiLock
                style={{
                  float: 'right',
                }}
                size={30}
                onClick={() => {
                  showValidateModal();
                }}
              />
            ) : (
              <CiUnlock
                style={{
                  float: 'right',
                }}
                size={30}
                onClick={() => {
                  showValidateModal();
                }}
              />
            )} */}
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
