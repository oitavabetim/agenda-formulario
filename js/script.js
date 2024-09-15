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
