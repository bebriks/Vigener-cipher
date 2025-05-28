  //const [hasCyrillic, setHasCyrillic] = useState(false)

  /* useEffect(() => {
    const cleaned = processText(input);
    const hasChars = cleaned.length > 0;
    setHasCyrillic(/[а-я]/.test(cleaned))
    
    setHasValidChars(hasChars);
    setMaxKey(hasCyrillic ? 32 : 26);
    setError(hasChars ? '' : 'Текст должен содержать буквы кириллицы или латиницы');
  }, [input]);

  const handleProcess = () => {
    setKey(0)
    setInput('')
    setOutput('')
    setError('')
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
    setError('');
  };

  const validateKey = (value: number): string => {
    if (value < -maxKey || value > maxKey) return `Ключ должен быть от ${-maxKey} до ${maxKey}`;
    if (isNaN(value)) return 'Введите числовое значение';
    return '';
  };

  const handleCipher = (action: 'encrypt' | 'decrypt') => {
    const keyError = validateKey(key);
    if (keyError) {
      setError(keyError);
      return;
    }

    if (!hasValidChars) {
      setError('Введите текст с допустимыми символами');
      return;
    }

    try {
      const cleaned = processText(input);
      const adjustedKey = adjustKey(key);
      const result = action === 'encrypt' 
        ? encrypt(cleaned, adjustedKey)
        : decrypt(cleaned, adjustedKey);
      
      setOutput(groupText(result));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка обработки текста');
    }
  }; */
