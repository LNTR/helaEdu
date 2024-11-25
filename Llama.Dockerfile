FROM ollama/ollama:latest

VOLUME [ "/root/.ollama" ]
EXPOSE 11434
RUN /bin/ollama serve ||\
    ollama pull orca-mini