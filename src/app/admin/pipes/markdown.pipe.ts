import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

/**
 * Pipe para converter Markdown em HTML
 * Suporta formatação básica: negrito, itálico, listas, código, etc.
 */
@Pipe({
  name: 'markdown',
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
    // Configura opções do marked para segurança
    marked.setOptions({
      breaks: true, // Quebra de linha vira <br>
      gfm: true, // GitHub Flavored Markdown
    });
  }

  transform(value: string): SafeHtml {
    if (!value) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    try {
      // Converte markdown para HTML
      const html = marked.parse(value) as string;
      
      // Sanitiza o HTML removendo elementos inseguros
      const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, html);
      
      // Retorna como SafeHtml para permitir renderização
      return this.sanitizer.bypassSecurityTrustHtml(sanitized || '');
    } catch (error) {
      console.warn('Erro ao processar markdown:', error);
      // Retorna o texto original escapado se houver erro
      const escaped = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      return this.sanitizer.bypassSecurityTrustHtml(escaped);
    }
  }
}

