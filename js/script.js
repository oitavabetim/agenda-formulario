$(document).ready(function() {
    $("#reservationForm").on("submit", function(event) {
        event.preventDefault();

        // Obter o formulário e adicionar a classe de validação
        $(this).addClass('was-validated');

        // Verificar se o formulário é válido
        if (!this.checkValidity()) {
            return;
        }

        // Obter os horários de início e fim
        const startTime = $("#startTime").val();
        const endTime = $("#endTime").val();
        
        // Verificar se o horário final é maior que o horário de início
        if (new Date("1970-01-01T" + endTime) <= new Date("1970-01-01T" + startTime)) {
            alert("O horário de fim deve ser maior que o horário de início.");
            return;
        }

        // Verificar se há pelo menos 30 minutos de diferença
        const startDate = new Date("1970-01-01T" + startTime);
        const endDate = new Date("1970-01-01T" + endTime);
        const diffInMinutes = (endDate - startDate) / (1000 * 60);

        if (diffInMinutes < 30) {
            alert("O intervalo entre o horário de início e o horário de fim, deve ser de pelo menos 30 minutos.");
            return;
        }

        // Bloqueio agendamento
        const eventDate = $("#eventDate").val();
        const dateNow = new Date();
              dateNow.setHours(0, 0, 0, 0);
        const dateNowDay = dateNow.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        const [year, month, day] = eventDate.split("-").map(Number);
        const reservationDate = new Date(year, month - 1, day); // Cria sem ajuste de fuso
        reservationDate.setHours(0, 0, 0, 0); // Garante que a data esteja em meia-noite  

        let startDateAllowedReservation = dateNow;

        // Segunda a Quinta
        if (dateNowDay >= 0 && dateNowDay <= 4) { 
            startDateAllowedReservation.setDate(dateNow.getDate() + (8 - dateNowDay)); // Libera reserva para próxima segunda
        } else { // Sexta a Domingo
            startDateAllowedReservation.setDate(dateNow.getDate() + (8 - dateNowDay) + 7); // Libera reserva somente para próxima segunda da outra semana
        }

        if (reservationDate < startDateAllowedReservation) {
            alert("Agenda bloqueada para registro de eventos antes do dia " + startDateAllowedReservation.toLocaleDateString("pt-BR") + ", garantindo que as equipes de diáconos e cozinha tenham tempo hábil para se organizar e melhor atender às programações.");
            return;
        }

        const reservationData = {
            eventDate: $("#eventDate").val(),
            startTime: $("#startTime").val(),
            endTime: $("#endTime").val(),
            space: $("#space").val(),
            eventTitle: $("#eventTitle").val(),
            eventOwner: $("#eventOwner").val(),
            contactPhone: $("#contactPhone").val(),
            eventNotes: $("#eventNotes").val()
        };

        // Exibe loading
        $('body').waitMe({
            effect : 'facebook',
            color : '#007bff'
        });

        $.ajax({
            url: "https://fun-agenda-prod.azurewebsites.net/api/agendar",
            //url: "http://localhost:7004/api/agendar",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(reservationData),
            dataType: "json",
            success: function(response) {
                alert("Reserva realizada com sucesso!");
                location.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                let errorMessage = "Atenção";
                if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                    errorMessage += ": " + jqXHR.responseJSON.message;
                }
                $('body').waitMe('hide');
                alert(errorMessage);
            }
        });
    });
});
